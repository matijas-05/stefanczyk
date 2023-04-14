import type { IncomingMessage, ServerResponse } from "node:http";
import formidable from "formidable";
import { pino } from "./logger";
import * as model from "./model";
import { parseFormData } from "./controllers/file";

export async function router(req: IncomingMessage, res: ServerResponse) {
	pino.info(`Request: ${req.method} ${req.url}`);

	switch (req.method?.toUpperCase()) {
		case "GET": {
			if (req.url === "/api/photos") {
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify(model.getAll()));
				break;
			} else {
				const matches = req.url?.matchAll(/\/api\/photos\/([0-9]+)/g);

				if (matches) {
					for (const match of matches) {
						const id = parseInt(match[1]);
						const image = model.getAll().find((image) => image.id === id);
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

			break;
		}
		case "POST": {
			switch (req.url) {
				case "/api/photos": {
					try {
						const data = await parseFormData(req);

						if (Array.isArray(data.files)) {
							(data.files as formidable.File[]).forEach((file) => {
								model.add({
									id: model.getAll().length,
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
								});
							});
						} else {
							const file = data.files.file as formidable.File;
							model.add({
								id: model.getAll().length,
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
					const image = model.getAll().find((image) => image.id === id);
					if (image) {
						model.remove(image);
						res.writeHead(204).end();
					} else {
						res.writeHead(404).end();
					}
				}
			}
		}
	}
}
