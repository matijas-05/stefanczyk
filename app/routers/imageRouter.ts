import type { IncomingMessage, ServerResponse } from "node:http";
import formidable from "formidable";
import * as imageModel from "../models/imageModel";
import * as tagModel from "../models/tagModel";
import { parseFormData } from "../controllers/fileController";
import { parse } from "../controllers/jsonController";

export async function imageRouter(req: IncomingMessage, res: ServerResponse) {
	switch (req.method?.toUpperCase()) {
		case "GET": {
			if (req.url === "/api/photos") {
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify(imageModel.getAll()));
				break;
			} else {
				const matches = req.url?.matchAll(/\/api\/photos\/([0-9]+)/g);

				if (matches) {
					for (const match of matches) {
						const id = parseInt(match[1]);
						const image = imageModel.getAll().find((image) => image.id === id);
						if (image) {
							res.writeHead(200, { "Content-Type": "application/json" });
							res.end(JSON.stringify(image));
						} else {
							res.writeHead(404).end();
						}
					}
				}

				break;
			}
		}

		case "POST": {
			switch (req.url) {
				case "/api/photos": {
					try {
						const data = await parseFormData(req);

						if (Array.isArray(data.files)) {
							(data.files as formidable.File[]).forEach((file) => {
								imageModel.add({
									id: imageModel.getAll().length,
									album: data.fields.album as string,
									originalName: file.name!,
									url: file.path,
									lastChange: new Date(),
									history: [
										{
											status: "original",
											timestamp: new Date(),
										},
									],
									tags: [],
								});
							});
						} else {
							const file = data.files.file as formidable.File;
							imageModel.add({
								id: imageModel.getAll().length,
								album: data.fields.album as string,
								originalName: file.name!,
								url: file.path,
								lastChange: new Date(),
								history: [
									{
										status: "original",
										timestamp: new Date(),
									},
								],
								tags: [],
							});
						}
						res.writeHead(201).end();
					} catch (error) {
						res.writeHead(500).end();
					}

					break;
				}
			}
		}

		case "DELETE": {
			const matches = req.url?.matchAll(/\/api\/photos\/([0-9]+)/g);

			if (matches) {
				for (const match of matches) {
					const id = parseInt(match[1]);
					const image = imageModel.getAll().find((image) => image.id === id);
					if (image) {
						imageModel.remove(image);
						res.writeHead(204).end();
					} else {
						res.writeHead(404).end();
					}
				}
			}
		}

		case "PATCH": {
			const editPhoto = Array.from(req.url?.matchAll(/\/api\/photos\/([0-9]+)$/g) ?? []);
			const addTagToPhoto = Array.from(
				req.url?.matchAll(/\/api\/photos\/([0-9]+)\/tags$/g) ?? []
			);
			const addTagsToPhoto = Array.from(
				req.url?.matchAll(/\/api\/photos\/([0-9]+)\/tags\/mass$/g) ?? []
			);

			if (editPhoto.length > 0) {
				for (const match of editPhoto) {
					const id = parseInt(match[1]);
					const image = imageModel.getAll().find((image) => image.id === id);

					if (image) {
						const data = await parseFormData(req);
						imageModel.update(id, {
							album: data.fields.album as string,
							lastChange: new Date(),
							originalName: (data.files.file as formidable.File).name!,
							url: (data.files.file as formidable.File).path,
							history: [
								...image.history,
								{ status: "edited", timestamp: new Date() },
							],
						});

						res.writeHead(204).end();
					} else {
						res.writeHead(404).end();
					}
				}
			} else if (addTagToPhoto.length > 0) {
				for (const match of addTagToPhoto) {
					const imageId = parseInt(match[1]);
					const image = imageModel.get(imageId);
					const tag = await parse<tagModel.Tag>(req);

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
					const tags = await parse<tagModel.Tag[]>(req);

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
		}
	}
}
