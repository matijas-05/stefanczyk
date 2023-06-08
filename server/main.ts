import http from "node:http";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { router } from "./app/routers";
import { pino } from "./app/logger";

dotenv.config();

const server = http.createServer((req, res) => router(req, res));
server.listen(process.env.PORT, async () => {
	pino.info("Server started on port " + process.env.PORT);
	await mongoose.connect(process.env.DB_URI!);
	pino.info("Connected to database");
});
