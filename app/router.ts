import type { IncomingMessage, ServerResponse } from "node:http";

export function router(req: IncomingMessage, res: ServerResponse) {
	res.writeHead(200, { "Content-Type": "text/plain" });
	res.end("Hello World");
}
