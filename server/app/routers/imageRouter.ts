import type { IncomingMessage, ServerResponse } from "node:http";
import fs from "node:fs/promises";
import formidable from "formidable";
import { ImageModel, type ImageHistory } from "../models/imageModel";
import * as tagModel from "../models/tagModel";
import { getFullPath, parseFormData } from "../controllers/fileController";
import { parseJson } from "../controllers/jsonController";
import { verifyToken } from "../controllers/userController";
import { UserModel } from "../models/userModel";

export async function imageRouter(req: IncomingMessage, res: ServerResponse, token: string) {
	switch (req.method?.toUpperCase()) {
		case "GET": {
			if (req.url === "/api/photos") {
				const images = await ImageModel.find().sort({ lastChange: -1 });

				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify(images));
			} else {
				const getPhoto = Array.from(req.url?.matchAll(/\/api\/photos\/(\w+)/g) ?? []);
				const getPhotoTags = Array.from(
					req.url?.matchAll(/\/api\/photos\/(\w+)\/tags/g) ?? []
				);

				if (getPhoto.length > 0 && getPhotoTags.length === 0) {
					const id = getPhoto[0][1];
					const image = await ImageModel.findById(id);
					if (!image) {
						res.writeHead(404).end();
						return;
					}

					res.writeHead(200, { "Content-Type": "application/json" });
					res.end(JSON.stringify(image));
				} else if (getPhotoTags.length > 0) {
					const id = getPhotoTags[0][1];

					const image = await ImageModel.findById(id).populate("tags");
					if (!image) {
						res.writeHead(404).end();
						return;
					}

					res.writeHead(200, { "Content-Type": "application/json" });
					res.end(JSON.stringify(image?.tags));
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
				const newImage = (file: formidable.File, fields: formidable.Fields) => ({
					user: user!._id,
					url: file.path,
					history: [{ status: "original", timestamp: new Date() }],
					lastChange: new Date(),
					tags: JSON.parse(fields.tags as string),
				});

				if (Array.isArray(data.files)) {
					(data.files as formidable.File[]).forEach(async (file) => {
						await ImageModel.create(newImage(file, data.fields));
					});
				} else {
					const file = data.files.file as formidable.File;
					await ImageModel.create(newImage(file, data.fields));
				}

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
				const image = await ImageModel.findByIdAndDelete(id);

				if (!image) {
					res.writeHead(404).end();
					return;
				}

				await fs.rm(getFullPath(image!.url.toString()));
				res.writeHead(204).end();
			}

			break;
		}

		case "PATCH": {
			const editPhoto = Array.from(req.url?.matchAll(/\/api\/photos\/(\w+)$/g) ?? []);
			const addTagToPhoto = Array.from(
				req.url?.matchAll(/\/api\/photos\/(\w+)\/tags$/g) ?? []
			);
			const addTagsToPhoto = Array.from(
				req.url?.matchAll(/\/api\/photos\/(\w+)\/tags\/mass$/g) ?? []
			);

			if (editPhoto.length > 0) {
				const id = editPhoto[0][1];
				const data = await parseFormData(req);
				const file = data.files.file as formidable.File;

				const image = await ImageModel.findByIdAndUpdate(id, {
					$set: {
						url: file.path,
					},
					$push: {
						history: {
							status: "edited",
							timestamp: new Date(),
						} satisfies ImageHistory,
					},
				});
				if (!image) {
					res.writeHead(404).end();
					return;
				}

				await fs.rm(getFullPath(image.url.toString()));
				res.writeHead(204).end();
			} else if (addTagToPhoto.length > 0) {
				for (const match of addTagToPhoto) {
					const imageId = parseInt(match[1]);
					const image = imageModel.get(imageId);
					const tag = await parseJson<tagModel.Tag>(req);

					if (image && tag) {
						try {
							imageModel.addTag(imageId, tag);
							res.writeHead(204).end();
						} catch (error) {
							res.writeHead(409).end();
						}
					} else {
						res.writeHead(404).end();
					}
				}
			} else if (addTagsToPhoto.length > 0) {
				for (const match of addTagsToPhoto) {
					const imageId = parseInt(match[1]);
					const image = imageModel.get(imageId);
					const tags = await parseJson<tagModel.Tag[]>(req);

					if (image && tags) {
						try {
							imageModel.addTags(imageId, tags);
							res.writeHead(204).end();
						} catch (error) {
							res.writeHead(409).end();
						}
					} else {
						res.writeHead(404).end();
					}
				}
			}
			break;
		}
	}
}
