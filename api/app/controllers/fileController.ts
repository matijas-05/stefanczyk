import { IncomingMessage } from "node:http";
import formidable from "formidable";

export function parseFormData(req: IncomingMessage) {
	const form = formidable({
		uploadDir: "./uploads",
		keepExtensions: true,
		multiples: true,
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
