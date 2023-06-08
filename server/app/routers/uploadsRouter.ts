import type { IncomingMessage, ServerResponse } from "node:http";
import fs from "node:fs/promises";
import { getFullPath } from "../controllers/fileController";

export async function uploadsRouter(req: IncomingMessage, res: ServerResponse) {
	switch (req.method?.toUpperCase()) {
		case "GET": {
			try {
				const imagePath = req.url?.split("/api/")?.[1];
				const ext = imagePath?.split(".")?.[1];
				const image = await fs.readFile(getFullPath(imagePath!));

				res.writeHead(200, { "Content-Type": `image/${ext}` });
				res.end(image);
			} catch (error) {
				res.writeHead(404).end();
			}
			break;
		}
	}
}
