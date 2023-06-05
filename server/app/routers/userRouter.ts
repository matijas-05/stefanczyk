import type { IncomingMessage, ServerResponse } from "node:http";
import fs from "node:fs/promises";
import { parseJson } from "../controllers/jsonController";
import * as userModel from "../models/userModel";
import * as userController from "../controllers/userController";
import * as fileController from "../controllers/fileController";
import formidable from "formidable";
import * as cookie from "cookie";

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
					const setCookieHeader = cookie.serialize("token", token, {
						httpOnly: false,
						sameSite: "strict",
						path: "/",
						secure: false,
						maxAge: 60 * 60 * 24 * 7,
					});

					res.writeHead(200, {
						"Content-Type": "application/json",
						"Set-Cookie": setCookieHeader,
					}).end();
				} catch (error) {
					if (error instanceof Error) {
						if (error.message === "not_confirmed") {
							res.writeHead(403).end("User not confirmed");
						} else if (error.message === "credentials") {
							res.writeHead(401).end();
						}
					}
				}
			} else if (req.url === "/api/user/profile") {
				const token = req.headers.authorization?.split(" ")[1];
				if (!token) {
					res.writeHead(400).end();
					return;
				}

				const payload = userController.verifyToken(token);
				if (!payload) {
					res.writeHead(401).end();
					return;
				}

				const user = userModel.get(payload.email)!;
				if (!user) {
					res.writeHead(404).end();
					return;
				}

				const path = `./uploads/${user.id}`;
				await fs.mkdir(path, { recursive: true });

				try {
					const { files } = await fileController.parseFormData(req, path);
					if (!files) {
						res.writeHead(400).end();
						return;
					}

					const user = userModel.get(payload.email)!;
					userModel.update({
						...user,
						profilePicture: (files.file as formidable.File).path,
					});

					res.writeHead(201).end();
				} catch (error) {
					res.writeHead(500).end(error);
					return;
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
			} else if (req.url === "/api/user/profile") {
				const token = req.headers.authorization?.split(" ")[1];
				if (!token) {
					res.writeHead(400).end();
					return;
				}

				try {
					const payload = userController.verifyToken(token);
					if (!payload) {
						res.writeHead(401).end();
						return;
					}

					const user = userModel.get(payload.email)!;
					res.writeHead(200, { "Content-Type": "application/json" }).end(
						JSON.stringify({
							name: user.name,
							lastName: user.lastName,
							email: user.email,
							profilePicture: user.profilePicture,
						})
					);
				} catch (error) {
					res.writeHead(500).end();
				}
			} else if (req.url === "/api/user/logout") {
				const token = req.headers.authorization?.split(" ")[1];
				if (!token) {
					res.writeHead(400).end();
					return;
				}

				const payload = userController.verifyToken(token);
				if (!payload) {
					res.writeHead(401).end();
					return;
				}

				try {
					userController.logout(payload.email, token);
					res.writeHead(200).end();
				} catch (error) {
					res.writeHead(500).end();
				}
			}
		}

		case "PATCH": {
			if (req.url === "/api/user/profile") {
				const token = req.headers.authorization?.split(" ")[1];
				if (!token) {
					res.writeHead(400).end();
					return;
				}

				try {
					const payload = userController.verifyToken(token);
					if (!payload) {
						res.writeHead(401).end();
						return;
					}

					const user = userModel.get(payload.email)!;

					const newUser = await parseJson<Pick<userModel.User, "name" | "lastName">>(req);
					if (!newUser) {
						res.writeHead(400).end();
						return;
					}

					userModel.update({ ...user, name: newUser.name, lastName: newUser.lastName });
					res.writeHead(200).end();
				} catch (error) {
					res.writeHead(500).end();
				}
			}
		}
	}
}
