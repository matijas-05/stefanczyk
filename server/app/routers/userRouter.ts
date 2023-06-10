import type { IncomingMessage, ServerResponse } from "node:http";
import fs from "node:fs/promises";
import { parseJson } from "../controllers/jsonController";
import { UserModel, type User } from "../models/userModel";
import * as userController from "../controllers/userController";
import * as fileController from "../controllers/fileController";
import * as Cookies from "cookie";
import type formidable from "formidable";
import type { Profile } from "@/types";

export async function userRouter(req: IncomingMessage, res: ServerResponse, token: string) {
	switch (req?.method?.toUpperCase()) {
		case "POST": {
			if (req.url === "/api/user/register") {
				const user = await parseJson<User>(req);
				if (!user) {
					res.writeHead(400).end();
					return;
				}

				let token = "";
				try {
					token = await userController.register(user);
				} catch (error) {
					if (error instanceof Error) {
						res.writeHead(409).end(error.message);
					}
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
					const setCookieHeader = Cookies.serialize("token", token, {
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
				const payload = userController.verifyToken(token);
				if (!payload) {
					res.writeHead(401).end();
					return;
				}

				const user = await UserModel.findOne({ email: payload.email });
				if (!user) {
					res.writeHead(404).end();
					return;
				}

				try {
					const data = await fileController.parseFormData(req);
					const photo = data.files.photo as formidable.File;
					if (!photo) {
						res.writeHead(400).end();
						return;
					}

					if (user.profilePicture) {
						await fs.rm(fileController.getFullPath(user.profilePicture));
					}
					await UserModel.updateOne(
						{ email: payload.email },
						{ profilePicture: photo.path }
					);

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
					await userController.confirm(token);
					res.writeHead(200).end();
				} catch (error) {
					res.writeHead(400).end();
				}
			} else if (req.url === "/api/user/profile") {
				try {
					const payload = userController.verifyToken(token);
					if (!payload) {
						res.writeHead(401).end();
						return;
					}

					const user = await UserModel.findOne({ email: payload.email });
					if (!user) {
						res.writeHead(404).end();
						return;
					}

					res.writeHead(200, { "Content-Type": "application/json" }).end(
						JSON.stringify({
							name: user.name,
							lastName: user.lastName,
							email: user.email,
							username: user.username,
							profilePicture: user.profilePicture,
						} satisfies Profile)
					);
				} catch (error) {
					res.writeHead(500).end();
				}
			} else if (req.url === "/api/user/logout") {
				const payload = userController.verifyToken(token);
				if (!payload) {
					res.writeHead(401).end();
					return;
				}

				try {
					await userController.logout(payload.email, token);
					res.setHeader(
						"Set-Cookie",
						Cookies.serialize("token", "", {
							expires: new Date(0),
							path: "/",
							sameSite: "strict",
						})
					);
					res.writeHead(200).end();
				} catch (error) {
					res.writeHead(500).end();
				}
			}
			break;
		}

		case "PATCH": {
			if (req.url === "/api/user/profile") {
				try {
					const payload = userController.verifyToken(token);
					if (!payload) {
						res.writeHead(401).end();
						return;
					}

					const user = await UserModel.findOne({ email: payload.email });
					const newUser = await parseJson<Pick<User, "name" | "lastName">>(req);
					if (!newUser) {
						res.writeHead(400).end();
						return;
					}

					await UserModel.updateOne(
						{ email: payload.email },
						{ name: newUser.name, lastName: newUser.lastName }
					);
					res.writeHead(200).end();
				} catch (error) {
					res.writeHead(500).end();
				}
			}
			break;
		}
	}
}
