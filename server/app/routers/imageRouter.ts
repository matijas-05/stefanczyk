import type { IncomingMessage, ServerResponse } from "node:http";
import fs from "node:fs/promises";
import formidable from "formidable";
import { TagModel } from "../models/tagModel";
import { getFullPath, parseFormData } from "../controllers/fileController";
import { verifyToken } from "../controllers/userController";
import { UserModel } from "../models/userModel";
import { PostModel, type ImageHistory } from "../models/postModel";

export async function imageRouter(req: IncomingMessage, res: ServerResponse, token: string) {
	switch (req.method?.toUpperCase()) {
		case "GET": {
			if (req.url === "/api/photos") {
				const posts = await PostModel.find()
					.sort({ lastChange: -1 })
					.populate("user", "-password -confirmed")
					.populate("tags");

				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify(posts));
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

				if (Array.isArray(data.files.photos)) {
					(data.files.photos as formidable.File[]).forEach(async (file) => {
						images.push(file.path);
					});
				} else {
					const file = data.files.photos as formidable.File;
					images.push(file.path);
				}

				const tagNames = JSON.parse(data.fields.tags as string) as string[];
				const tags = [];

				for (const tagName of tagNames) {
					const tag = await TagModel.findOne({ name: tagName });

					if (tag) {
						await tag.updateOne({
							$inc: { popularity: 1 },
						});
						tags.push(tag);
					} else {
						tags.push(
							await TagModel.create({
								name: tagName,
								popularity: 1,
							})
						);
					}
				}

				await PostModel.create({
					user: user!._id,
					images,
					description: data.fields.description as string,
					lastChange: new Date(),
					history: [{ status: "original", timestamp: new Date() } satisfies ImageHistory],
					tags: tags.map((tag) => tag._id),
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
			// const editPhoto = Array.from(req.url?.matchAll(/\/api\/photos\/(\w+)$/g) ?? []);
			// const addTagToPhoto = Array.from(
			// 	req.url?.matchAll(/\/api\/photos\/(\w+)\/tags$/g) ?? []
			// );
			// const addTagsToPhoto = Array.from(
			// 	req.url?.matchAll(/\/api\/photos\/(\w+)\/tags\/mass$/g) ?? []
			// );

			// if (editPhoto.length > 0) {
			// 	const id = editPhoto[0][1];
			// 	const data = await parseFormData(req);
			// 	const file = data.files.files as formidable.File;

			// 	const image = await ImageModel.findByIdAndUpdate(id, {
			// 		$set: {
			// 			url: file.path,
			// 			lastChange: new Date(),
			// 		},
			// 		$push: {
			// 			history: {
			// 				status: "edited",
			// 				timestamp: new Date(),
			// 			} satisfies ImageHistory,
			// 		},
			// 	});
			// 	if (!image) {
			// 		res.writeHead(404).end();
			// 		return;
			// 	}

			// 	await fs.rm(getFullPath(image.url.toString()));
			// 	res.writeHead(204).end();
			// } else if (addTagToPhoto.length > 0) {
			// 	for (const match of addTagToPhoto) {
			// 		const imageId = parseInt(match[1]);
			// 		const image = imageModel.get(imageId);
			// 		const tag = await parseJson<tagModel.Tag>(req);

			// 		if (image && tag) {
			// 			try {
			// 				imageModel.addTag(imageId, tag);
			// 				res.writeHead(204).end();
			// 			} catch (error) {
			// 				res.writeHead(409).end();
			// 			}
			// 		} else {
			// 			res.writeHead(404).end();
			// 		}
			// 	}
			// } else if (addTagsToPhoto.length > 0) {
			// 	for (const match of addTagsToPhoto) {
			// 		const imageId = parseInt(match[1]);
			// 		const image = imageModel.get(imageId);
			// 		const tags = await parseJson<tagModel.Tag[]>(req);

			// 		if (image && tags) {
			// 			try {
			// 				imageModel.addTags(imageId, tags);
			// 				res.writeHead(204).end();
			// 			} catch (error) {
			// 				res.writeHead(409).end();
			// 			}
			// 		} else {
			// 			res.writeHead(404).end();
			// 		}
			// 	}
			// }
			break;
		}
	}
}
