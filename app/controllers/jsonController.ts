import { IncomingMessage } from "node:http";

export async function parse<T>(req: IncomingMessage) {
	return new Promise<T>((resolve, reject) => {
		let body = "";

		req.on("data", (chunk) => {
			body += chunk.toString();
		});

		req.on("end", () => {
			try {
				resolve(JSON.parse(body) as T);
			} catch (error) {
				reject(error);
			}
		});

		req.on("error", (err) => {
			reject(err);
		});
	});
}
