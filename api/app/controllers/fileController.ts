import { IncomingMessage } from "node:http";
import fs from "node:fs/promises";
import formidable from "formidable";
import path from "node:path";

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

export async function getFile(path: string) {
	return fs.readFile(path);
}

export function getFullPath(url: string) {
	return path.resolve(path.dirname(new URL(import.meta.url).pathname), "../../", url);
}
