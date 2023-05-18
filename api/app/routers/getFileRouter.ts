import type { IncomingMessage, ServerResponse } from "node:http";
import * as imageModel from "../models/imageModel";
import * as fileController from "../controllers/fileController";

export async function getFileRouter(req: IncomingMessage, res: ServerResponse) {
	switch (req.method?.toUpperCase()) {
		case "GET": {
			const getFileMatch = Array.from(req.url?.matchAll(/\/api\/getFile\/([0-9]+)$/g) ?? []);

			if (getFileMatch.length > 0) {
				const fileId = parseInt(getFileMatch[0][1]);
				const url = imageModel.get(fileId)?.url;

				if (!url) {
					res.writeHead(404).end();
					return;
				}

				const file = await fileController.getFile(fileController.getFullPath(url));

				if (!file) {
					res.writeHead(500).end();
					return;
				}

				res.writeHead(200, { "Content-Type": "image/" + url?.split(".").pop() });
				res.end(file);
			}
		}
	}
}
