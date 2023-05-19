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
