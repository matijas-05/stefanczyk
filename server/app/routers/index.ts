import { IncomingMessage, ServerResponse } from "node:http";
import { pino } from "../logger";
import { imageRouter } from "./imageRouter";
import { tagRouter } from "./tagRouter";
import { filterRouter } from "./filterRouter";
import { getFileRouter } from "./getFileRouter";
import { userRouter } from "./userRouter";

export async function router(req: IncomingMessage, res: ServerResponse) {
	pino.info(`Request: ${req.method} ${req.url}`);

	res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
	if (req.method === "OPTIONS") {
		res.writeHead(200, {
			"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, Authorization",
		});
		res.end();
		return;
	}

	if (req.url?.startsWith("/api/photos")) {
		return await imageRouter(req, res);
	} else if (req.url?.startsWith("/api/tags")) {
		return await tagRouter(req, res);
	} else if (req.url?.startsWith("/api/filters")) {
		return await filterRouter(req, res);
	} else if (req.url?.startsWith("/api/getFile")) {
		return await getFileRouter(req, res);
	} else if (req.url?.startsWith("/api/user")) {
		return await userRouter(req, res);
	} else {
		pino.warn("Route not matched: " + req.url);
	}
}
