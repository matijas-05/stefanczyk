import sharp from "sharp";
import { getFullPath } from "../controllers/fileController";
import type { FilterName } from "@/types";

export const filterNames = ["grayscale", "flip", "flop", "negate"] as const;

export function getSharpObject(imagePath: string) {
	return sharp(getFullPath(imagePath));
}

export async function getMetadata(imagePath: string) {
	return await getSharpObject(imagePath).metadata();
}

export function filterNameValid(filterName: string) {
	return filterNames.includes(filterName as FilterName);
}
