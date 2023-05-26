import http from "node:http";
import { router } from "./app/routers";
import { pino } from "./app/logger";
import dotenv from "dotenv";

dotenv.config();

const server = http.createServer((req, res) => router(req, res));
server.listen(process.env.PORT, () => pino.info("Server started on port " + process.env.PORT));
