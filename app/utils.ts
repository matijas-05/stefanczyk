import logger from "pino";
import formidable from "formidable";
import { IncomingMessage } from "http";

export const pino = logger({
	transport: {
		target: "pino-pretty",
	},
});

export function parseFormData(req: IncomingMessage) {
	const form = formidable({
		uploadDir: "./uploads",
		keepExtensions: true,
	});

	return new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
		(resolve, reject) => {
			form.parse(req, (err, fields, files) => {
				if (err) {
					reject(err);
				} else {
					resolve({ fields, files });
				}
			});
		}
	);
}
