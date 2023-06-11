import { IncomingMessage, ServerResponse } from "node:http";
import { TagModel } from "../models/tagModel";

export async function tagRouter(req: IncomingMessage, res: ServerResponse) {
	switch (req.method?.toUpperCase()) {
		case "GET": {
			if (req.url === "/api/tags") {
				const tags = await TagModel.find();

				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify(tags));
			} else if (req.url?.startsWith("/api/tags/")) {
				const id = parseInt(req.url.split("/api/tags/")[1]);
				const tag = await TagModel.findById(id);

				if (tag) {
					res.writeHead(200, { "Content-Type": "application/json" });
					res.end(JSON.stringify(tag));
				} else {
					res.writeHead(404).end();
				}
			}
			break;
		}
	}
}
