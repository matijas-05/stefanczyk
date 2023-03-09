import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { Server } from "socket.io";
import type { ClientToServerEvents, Message, ServerToClientEvents } from "./types";

const messages: Message[] = [];

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
	socket.on("message", (data) => {
		messages.push(data);
		socket.broadcast.emit("message", data);
	});

	socket.on("getMessages", () => {
		socket.emit("getMessages", messages);
	});
});

server.listen(3000, () => {
	console.log("Server running on port 3000");
});
