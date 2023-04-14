import http from "node:http";
import logger from "pino";
import { router } from "./app/router";

const pino = logger({
	transport: {
		target: "pino-pretty",
	},
});

const server = http.createServer((req, res) => router(req, res));
server.listen(4000, () => pino.info("Server started on port 4000"));
