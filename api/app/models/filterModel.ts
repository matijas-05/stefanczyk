import sharp from "sharp";
import { getFullPath } from "../controllers/fileController";

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

export function getSharpObject(imagePath: string) {
	return sharp(getFullPath(imagePath));
}

export async function getMetadata(imagePath: string) {
	return await getSharpObject(imagePath).metadata();
}

export function filterNameValid(filterName: string) {
	return filterNames.includes(filterName as FilterName);
}
