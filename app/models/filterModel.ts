import path from "node:path";
import sharp from "sharp";

const filterNames = [
	"rotate",
	"resize",
	"reformat",
	"crop",
	"grayscale",
	"flip",
	"flop",
	"negate",
	"tint",
] as const;
export type FilterName = (typeof filterNames)[number];

export function getImagePath(imageUrl: string) {
	return path.resolve(path.dirname(new URL(import.meta.url).pathname), "../../", imageUrl);
}

export function getSharpObject(imagePath: string) {
	return sharp(getImagePath(imagePath));
}

export async function getMetadata(imagePath: string) {
	return await getSharpObject(imagePath).metadata();
}

export function filterNameValid(filterName: string) {
	return filterNames.includes(filterName as FilterName);
}
