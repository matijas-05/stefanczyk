import type { IncomingMessage } from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import formidable from "formidable";

/**
 * @param dir Relative to the /api directory. `uploads` folder is `./uploads`
 */
export function parseFormData(req: IncomingMessage, dir?: string) {
	const form = formidable({
		uploadDir: dir ?? "./uploads",
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
