import { IncomingMessage, ServerResponse } from "http";
import { pino } from "../logger";
import { imageRouter } from "./imageRouter";
import { tagRouter } from "./tagRouter";

export async function router(req: IncomingMessage, res: ServerResponse) {
	pino.info(`Request: ${req.method} ${req.url}`);

	if (req.url?.startsWith("/api/photos")) {
		return await imageRouter(req, res);
	} else if (req.url?.startsWith("/api/tags")) {
		return await tagRouter(req, res);
	}
}
