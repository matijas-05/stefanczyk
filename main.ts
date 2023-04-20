import http from "node:http";
import { router } from "./app/routers/";
import { pino } from "./app/logger";

const server = http.createServer((req, res) => router(req, res));
server.listen(3000, () => pino.info("Server started on port 4000"));
