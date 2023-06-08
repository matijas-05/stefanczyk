import type { IncomingMessage, ServerResponse } from "node:http";
import fs from "node:fs/promises";
import { getFullPath } from "../controllers/fileController";

export async function uploadsRouter(req: IncomingMessage, res: ServerResponse) {
	switch (req.method?.toUpperCase()) {
		case "GET": {
			const imagePath = req.url?.split("/api/")?.[1];
			const ext = imagePath?.split(".")?.[1];

			res.writeHead(200, { "Content-Type": `image/${ext}` });
			res.end(await fs.readFile(getFullPath(imagePath!)));
		}
	}
}
