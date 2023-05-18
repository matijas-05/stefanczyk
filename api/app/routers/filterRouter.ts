import { IncomingMessage, ServerResponse } from "node:http";
import fs from "node:fs/promises";
import * as imageModel from "../models/imageModel";
import * as filterModel from "../models/filterModel";
import * as filterController from "../controllers/filterController";
import { parseJson } from "../controllers/jsonController";
import type { AvailableFormatInfo, FormatEnum, Region } from "sharp";

export async function filterRouter(req: IncomingMessage, res: ServerResponse) {
	switch (req.method?.toUpperCase()) {
		case "GET": {
			const getPhotoMetadataMatch = Array.from(
				req.url?.matchAll(/\/api\/filters\/metadata\/([0-9]+)$/g) ?? []
			);

			if (getPhotoMetadataMatch.length > 0) {
				const photoId = parseInt(getPhotoMetadataMatch[0][1]);
				const image = imageModel.get(photoId);

				if (!image) {
					res.writeHead(404).end();
					return;
				}

				const metadata = await filterModel.getMetadata(image.url);
				if (!metadata.width || !metadata.height) {
					res.writeHead(500).end();
					return;
				}

				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ width: metadata.width, height: metadata.height }));
			}

			break;
		}

		case "PATCH": {
			const filterNameMatch = Array.from(
				req.url?.matchAll(/\/api\/filters\/([a-z]+)\/([0-9]+)$/g) ?? []
			);

			if (filterNameMatch.length > 0) {
				const filterName = filterNameMatch[0][1];
				const imageId = parseInt(filterNameMatch[0][2]);
				const image = imageModel.get(imageId);

				if (!filterModel.filterNameValid(filterName)) {
					res.writeHead(400).end();
					return;
				}

				if (!image) {
					res.writeHead(404).end();
					return;
				}

				const sharp = filterModel.getSharpObject(image.url);

				switch (filterName as filterModel.FilterName) {
					case "crop": {
						const body = await parseJson<Region>(req);
						filterController.crop(sharp, body);
						break;
					}

					case "rotate": {
						const body = await parseJson<{ angle: number }>(req);
						filterController.rotate(sharp, body.angle);
						break;
					}

					case "resize": {
						const body = await parseJson<{ width: number; height: number }>(req);
						filterController.resize(sharp, body.width, body.height);
						break;
					}

					case "reformat": {
						const body = await parseJson<{
							format: keyof FormatEnum | AvailableFormatInfo;
						}>(req);
						filterController.reformat(sharp, body.format);

						image.url = image.url.split(".").slice(0, -1).join(".") + `.${body.format}`;
						break;
					}

					case "grayscale": {
						filterController.grayscale(sharp);
						break;
					}

					default:
						break;
				}

				try {
					const imagePath = filterModel.getImagePath(image.url);
					const imagePathNoExt = imagePath.slice(0, imagePath.lastIndexOf("."));
					const imageExt = imagePath.slice(imagePath.lastIndexOf("."));

					await fs.writeFile(
						`${imagePathNoExt}-${filterName}${imageExt}`,
						await sharp.toBuffer()
					);

					imageModel.updateHistory(imageId, {
						status: filterName as filterModel.FilterName,
						timestamp: new Date(),
						url:
							image.url.split(".").slice(0, -1).join(".") +
							`-${filterName}.` +
							image.url.split(".").slice(-1),
					});

					res.writeHead(201).end();
				} catch (error) {
					res.writeHead(500).end();
				}
			}

			break;
		}
	}
}
