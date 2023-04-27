import { IncomingMessage, ServerResponse } from "node:http";
import * as model from "../models/tagModel";
import { parseJson } from "../controllers/jsonController";

export async function tagRouter(req: IncomingMessage, res: ServerResponse) {
	switch (req.method?.toUpperCase()) {
		case "GET": {
			if (req.url === "/api/tags/raw") {
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify(model.getAllRaw()));
			} else if (req.url === "/api/tags") {
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify(model.getAll()));
			} else {
				const matches = req.url?.matchAll(/\/api\/tags\/([0-9]+)/g);

				if (matches) {
					for (const match of matches) {
						const id = parseInt(match[1]);
						const image = model.get(id);

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
			if (req.url === "/api/tags") {
				let tag: model.Tag | undefined = undefined;
				try {
					tag = await parseJson<model.Tag>(req);
				} catch (error) {
					res.writeHead(400).end();
					return;
				}
				try {
					model.add(tag);
				} catch (error) {
					res.writeHead(409).end();
					return;
				}

				res.writeHead(201).end();
			}
			break;
		}
	}
}
