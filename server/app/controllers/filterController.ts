import type { FilterName } from "@/types";
import sharp, { type AvailableFormatInfo, type FormatEnum } from "sharp";

export const filterFunctions: Record<FilterName, (image: sharp.Sharp, params?: any) => void> = {
	flip: flip,
	flop: flop,
	grayscale: grayscale,
	negate: negate,
};

function crop(image: sharp.Sharp, region: sharp.Region) {
	image.extract(region);
}

function rotate(image: sharp.Sharp, degrees: number) {
	image.rotate(degrees);
}

function grayscale(image: sharp.Sharp) {
	image.grayscale();
}

function flip(image: sharp.Sharp) {
	image.flip();
}

function flop(image: sharp.Sharp) {
	image.flop();
}

function negate(image: sharp.Sharp) {
	image.negate();
}
