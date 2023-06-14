import type { IncomingMessage, ServerResponse } from "node:http";
import fs from "node:fs/promises";
import formidable from "formidable";
import { TagModel } from "../models/tagModel";
import { getFullPath, parseFormData } from "../controllers/fileController";
import { verifyToken } from "../controllers/userController";
import { UserModel } from "../models/userModel";
import { PostModel, type ImageHistory } from "../models/postModel";
import { parseJson } from "../controllers/jsonController";
import type { Tag } from "@/types";

export async function imageRouter(req: IncomingMessage, res: ServerResponse, token: string) {
	switch (req.method?.toUpperCase()) {
		case "GET": {
			if (req.url === "/api/photos") {
				const posts = await PostModel.find()
					.populate("user", "-password -confirmed")
					.populate("tags");

				const postSorted = posts.sort((a, b) => {
					const aPopularity = a.tags.reduce(
						(acc, tag) => acc + (tag as unknown as Tag).popularity,
						0
					);
					const bPopularity = b.tags.reduce(
						(acc, tag) => acc + (tag as unknown as Tag).popularity,
						0
					);

					return bPopularity - aPopularity;
				});

				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify(postSorted));
			} else if (req.url?.startsWith("/api/photos/user/")) {
				const username = req.url.split("/api/photos/user/")[1];
				const userId = await UserModel.findOne({ username }).select("_id");
				if (!userId) {
					res.writeHead(404).end();
					return;
				}

				const posts = await PostModel.find({ user: userId })
					.sort({ lastChange: -1 })
					.populate("user", "-password -confirmed")
					.populate("tags");

				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify(posts));
			} else {
				const getPhoto = Array.from(req.url?.matchAll(/\/api\/photos\/(\w+)/g) ?? []);

				if (getPhoto.length > 0) {
					const id = getPhoto[0][1];
					const post = await PostModel.findById(id)
						.populate("user", "-password -confirmed")
						.populate("tags");
					if (!post) {
						res.writeHead(404).end();
						return;
					}

					res.writeHead(200, { "Content-Type": "application/json" });
					res.end(JSON.stringify(post));
				}
			}
			break;
		}

		case "POST": {
			try {
				const payload = verifyToken(token);
				if (!payload) {
					res.writeHead(401).end();
					return;
				}

				const user = await UserModel.findOne({ email: payload.email });
				const data = await parseFormData(req);
				const images: string[] = [];
				const filters = JSON.parse(data.fields.filters as string) as string[];

				if (Array.isArray(data.files.photos)) {
					(data.files.photos as formidable.File[]).forEach(async (file) => {
						images.push(file.path);
					});
				} else {
					const file = data.files.photos as formidable.File;
					images.push(file.path);
				}

				const tagIds = await getTagIdsFromTagNames(
					JSON.parse(data.fields.tags as string) as string[]
				);

				await PostModel.create({
					user: user!._id,
					images,
					description: data.fields.description as string,
					lastChange: new Date(),
					history: [{ status: "original", timestamp: new Date() } satisfies ImageHistory],
					tags: tagIds,
				});

				res.writeHead(201).end();
			} catch (error) {
				if (error instanceof Error) {
					res.writeHead(500).end(error.message);
				}
			}

			break;
		}

		case "DELETE": {
			const matches = Array.from(req.url?.matchAll(/\/api\/photos\/(\w+)/g) ?? []);

			if (matches) {
				const id = matches[0][1];
				const post = await PostModel.findByIdAndDelete(id);

				if (!post) {
					res.writeHead(404).end();
					return;
				}

				for (const tagId of post.tags) {
					const tag = await TagModel.findById(tagId);

					if (tag!.popularity > 1) {
						await TagModel.updateOne({ _id: tagId }, { $inc: { popularity: -1 } });
					} else {
						await TagModel.findByIdAndDelete(tagId);
					}
				}

				await Promise.all(post.images.map((image) => fs.rm(getFullPath(image))));
				res.writeHead(204).end();
			}

			break;
		}

		case "PATCH": {
			if (req.url?.startsWith("/api/photos/")) {
				const id = req.url.split("/api/photos/")[1];
				const data = await parseJson<{ description: string; tags: string[] }>(req);

				const post = await PostModel.findById(id).populate("tags");

				if (!post) {
					res.writeHead(404).end();
					return;
				}

				const postTagNames = post.tags.map((tag) => (tag as unknown as Tag).name);
				const removedTagNames = postTagNames.filter((tag) => !data.tags.includes(tag));
				const tagIds = await getTagIdsFromTagNames(data.tags, false);

				for (const tagName of removedTagNames) {
					const tag = await TagModel.findOne({ name: tagName });

					if (tag!.popularity > 1) {
						await tag!.updateOne({ $inc: { popularity: -1 } });
					} else {
						await tag!.deleteOne();
					}
				}

				await post.updateOne({
					$set: {
						description: data.description,
						tags: tagIds,
						lastChange: new Date(),
						history: [
							...post.history,
							{ status: "edited", timestamp: new Date() } satisfies ImageHistory,
						],
					},
				});

				res.writeHead(204).end();
			}
		}
	}
}

async function getTagIdsFromTagNames(tagNames: string[], incrementPopularity = true) {
	const tags = [];

	for (const tagName of tagNames) {
		const tag = await TagModel.findOne({ name: tagName });

		if (tag) {
			if (incrementPopularity) {
				await tag.updateOne({
					$inc: { popularity: 1 },
				});
			}
			tags.push(tag);
		} else {
			tags.push(
				await TagModel.create({
					name: tagName.startsWith("#") ? tagName : `#${tagName}`,
					popularity: 1,
				})
			);
		}
	}

	return tags.map((tag) => tag._id);
}
