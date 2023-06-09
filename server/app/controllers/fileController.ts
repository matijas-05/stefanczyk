import type { IncomingMessage } from "node:http";
import path from "node:path";
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

export function getFullPath(url: string) {
	return path.resolve(path.dirname(new URL(import.meta.url).pathname), "../../", url);
}
