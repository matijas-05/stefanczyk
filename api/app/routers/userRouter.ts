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

				try {
					await userController.register(user);
				} catch (error) {
					res.writeHead(409).end();
					return;
				}

				res.writeHead(201).end();
			}
			break;
		}
	}
}
