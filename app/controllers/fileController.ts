import formidable from "formidable";
import { IncomingMessage } from "http";

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
