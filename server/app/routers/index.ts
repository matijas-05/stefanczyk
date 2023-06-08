import { IncomingMessage, ServerResponse } from "node:http";
import { pino } from "../logger";
import { imageRouter } from "./imageRouter";
import { tagRouter } from "./tagRouter";
import { filterRouter } from "./filterRouter";
import { uploadsRouter } from "./uploadsRouter";
import { userRouter } from "./userRouter";
import * as Cookies from "cookie";

const whitelist = ["/api/user/login", "/api/user/register", "/api/user/confirm"];

export async function router(req: IncomingMessage, res: ServerResponse) {
	pino.info(`Request: ${req.method} ${req.url}`);

	res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	if (req.method === "OPTIONS") {
		res.writeHead(200, {
			"Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type",
		}).end();
		pino.info(`Response: ${res.statusCode}`);
		return;
	}

	const token = Cookies.parse(req.headers.cookie ?? "").token;

	if (!token && whitelist.filter((url) => req.url?.startsWith(url)).length === 0) {
		res.writeHead(401).end();
		pino.info(`Response: ${res.statusCode}`);
		return;
	}

	if (req.url?.startsWith("/api/photos")) {
		await imageRouter(req, res, token);
	} else if (req.url?.startsWith("/api/tags")) {
		await tagRouter(req, res);
	} else if (req.url?.startsWith("/api/filters")) {
		await filterRouter(req, res);
	} else if (req.url?.startsWith("/api/uploads")) {
		await uploadsRouter(req, res);
	} else if (req.url?.startsWith("/api/user")) {
		await userRouter(req, res, token);
	} else {
		pino.warn("Route not matched: " + req.url);
		res.writeHead(404).end();
	}

	if (res.statusCode <= 399) {
		pino.info(`Response: ${res.statusCode}`);
	} else if (res.statusCode <= 499) {
		pino.warn(`Response: ${res.statusCode}`);
	} else {
		pino.error(`Response: ${res.statusCode}`);
	}
}
