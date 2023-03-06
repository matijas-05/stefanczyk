const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("static"));

const server = http.createServer(app);
const socketio = new Server(server);

/**
 * @type {Array<{username: string}>}
 */
const users = [];

socketio.on("connection", (client) => {
	console.log("client connected", client.id);

	client.on("waitForPlayer", (username) => {
		socketio.emit("waitForPlayer", {
			lastJoinedUsername: username,
		});

		if (users.length === 2) {
			socketio.emit("start");
			socketio.emit("beginRound", "white");
		}
	});

	client.on("beginRound", (color) => {
		console.log("beginRound", color);
		socketio.emit("beginRound", color);
	});
	client.on("endRound", (color) => {
		console.log("endRound", color);
		socketio.emit("endRound", color);
	});
	client.on("updateBoard", (board) => {
		console.log("update board", board);
		socketio.emit("updateBoard", board);
	});

	client.on("disconnect", (reason) => {
		console.log("client disconnected", reason);
	});
});

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/static/index.html");
});
app.post("/login", (req, res) => {
	if (users.length >= 2) {
		res.status(403).json({ error: "Too many users" });
		return;
	}
	if (users.find((user) => user.username === req.body.username)) {
		res.status(400).json({ error: "username" });
		return;
	}

	users.push({ username: req.body.username, color: getColor() });
	res.json({ color: users[users.length - 1].color });
	console.log(users);

	function getColor() {
		if (users.length === 0) return Math.random() > 0.5 ? "white" : "black";
		if (users.length === 1) return users[0].color === "white" ? "black" : "white";
	}
});
app.post("/canJoin", (req, res) => {
	res.send(users.length < 2);
});

server.listen(3000, () => {
	console.log("Działa na porcie 3000");
});
