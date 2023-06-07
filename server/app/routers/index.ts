import { IncomingMessage, ServerResponse } from "node:http";
import { pino } from "../logger";
import { imageRouter } from "./imageRouter";
import { tagRouter } from "./tagRouter";
import { filterRouter } from "./filterRouter";
import { getFileRouter } from "./getFileRouter";
import { userRouter } from "./userRouter";
import * as Cookies from "cookie";

const whitelist = ["/api/user/login", "/api/user/register", "/api/user/confirm"];

export async function router(req: IncomingMessage, res: ServerResponse) {
	pino.info(`Request: ${req.method} ${req.url}`);

	res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	if (req.method === "OPTIONS") {
		res.writeHead(200, {
			"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type",
		}).end();
		return;
	}

	const token = Cookies.parse(req.headers.cookie ?? "").token;

	if (!token && whitelist.filter((url) => req.url?.startsWith(url)).length === 0) {
		res.writeHead(401).end();
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
		return await userRouter(req, res, token);
	} else {
		pino.warn("Route not matched: " + req.url);
	}
}
