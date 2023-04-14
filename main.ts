import http from "node:http";
import { router } from "./app/router";
import { pino } from "./app/utils";

const server = http.createServer((req, res) => router(req, res));
server.listen(3000, () => pino.info("Server started on port 4000"));
