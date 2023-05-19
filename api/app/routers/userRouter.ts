import type { IncomingMessage, ServerResponse } from "node:http";
import { parseJson } from "../controllers/jsonController";
import * as userModel from "../models/userModel";
import * as userController from "../controllers/userController";

export async function userRouter(req: IncomingMessage, res: ServerResponse) {
	switch (req?.method?.toUpperCase()) {
		case "POST": {
			if (req.url === "/api/user/register") {
				const user = await parseJson<userModel.User>(req);
				if (!user) {
					res.writeHead(400).end();
					return;
				}

				let token = "";
				try {
					token = await userController.register(user);
				} catch (error) {
					res.writeHead(409).end();
					return;
				}

				res.writeHead(201, { "Content-Type": "application/json" }).end(
					JSON.stringify({ token })
				);
			} else if (req.url === "/api/user/login") {
				const loginData = await parseJson<{ email: string; password: string }>(req);
				if (!loginData) {
					res.writeHead(400).end();
					return;
				}

				try {
					const token = await userController.login(loginData.email, loginData.password);
					res.writeHead(200, { "Content-Type": "application/json" }).end(
						JSON.stringify({ token })
					);
				} catch (error) {
					if (error instanceof Error) {
						if (error.message === "User not confirmed") {
							res.writeHead(403).end("User not confirmed");
						} else if (error.message === "Credentials invalid") {
							res.writeHead(401).end();
						}
					}
				}
			}
			break;
		}

		case "GET": {
			if (req.url?.startsWith("/api/user/confirm/")) {
				const token = req.url.split("/confirm/")[1];
				if (!token) {
					res.writeHead(400).end();
					return;
				}

				try {
					userController.confirm(token);
					res.writeHead(200).end();
				} catch (error) {
					res.writeHead(400).end();
				}
			}
		}
	}
}
