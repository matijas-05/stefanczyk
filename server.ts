import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { Server } from "socket.io";
import type { ClientToServerEvents, Message, ServerToClientEvents, User } from "./types";

const messages: Message[] = [];
const users: User[] = [];

const server = http.createServer(async (req, res) => {
	let file: Buffer;

	if (req.url === "/") {
		file = await fs.readFile(`./client/index.html`);
		res.writeHead(200, { "Content-Type": "text/html" });
	} else if (req.url && req.url !== "") {
		try {
			file = await fs.readFile(`./client${req.url}`);
		} catch (error) {
			notFound(res);
			return;
		}

		const ext = path.extname(req.url);
		switch (ext) {
			case ".js": {
				res.writeHead(200, { "Content-Type": "text/javascript" });
				break;
			}
			default: {
				res.writeHead(200, { "Content-Type": `text/${ext.split(".")[1]}` });
			}
		}
	} else {
		notFound(res);
		return;
	}

	res.end(file);
});
function notFound(res: http.ServerResponse) {
	res.writeHead(404, { "Content-Type": "text/plain" });
	res.end("404 not found");
}

const io = new Server<ClientToServerEvents, ServerToClientEvents>(server);
io.on("connection", (socket) => {
	socket.on("userJoined", (username) => {
		const message = {
			username: username,
			message: "<span style='color: #aaa;'>dołączył do czatu</span>",
			type: "info",
		} as Message;

		messages.push(message);
		users.push({ id: socket.id, name: username });
		io.emit("message", message);
	});

	socket.on("message", (data) => {
		messages.push(data);
		io.emit("message", data);
	});
	socket.on("getMessages", () => {
		socket.emit("getMessages", messages);
	});

	socket.on("disconnect", () => {
		const user = users.find((user) => user.id === socket.id);
		if (user) {
			const message = {
				username: user.name,
				message: "<span style='color: #aaa;'>opuścił czat</span>",
				type: "info",
			} as Message;
			messages.push(message);

			io.emit("message", message);
		}
	});
});

server.listen(3000, () => {
	console.log("Server running on port 3000");
});
