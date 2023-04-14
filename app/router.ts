import type { IncomingMessage, ServerResponse } from "node:http";
import { parseFormData, pino } from "./utils";
import * as model from "./model";

export async function router(req: IncomingMessage, res: ServerResponse) {
	pino.info(`Request: ${req.method} ${req.url}`);

	switch (req.method?.toUpperCase()) {
		case "GET": {
			switch (req.url) {
				case "/api/photos": {
					res.writeHead(200, { "Content-Type": "application/json" });
					res.end(JSON.stringify(model.getAll()));
					break;
				}
			}
		}
		case "POST": {
			switch (req.url) {
				case "/api/photos": {
					const data = await parseFormData(req);
					console.log("Form Data:", data);

					res.end();
					break;
				}
			}
		}
	}
}
