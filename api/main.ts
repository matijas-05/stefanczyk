import http from "node:http";
import { router } from "./app/routers";
import { pino } from "./app/logger";

const PORT = 3000;
const server = http.createServer((req, res) => router(req, res));
server.listen(PORT, () => pino.info("Server started on port " + PORT));
