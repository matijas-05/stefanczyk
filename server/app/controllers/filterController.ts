import sharp, { type AvailableFormatInfo, type FormatEnum } from "sharp";

export function crop(image: sharp.Sharp, region: sharp.Region) {
	image.extract(region);
}

export function rotate(image: sharp.Sharp, degrees: number) {
	image.rotate(degrees);
}

export function resize(image: sharp.Sharp, width: number, height: number) {
	image.resize(width, height);
}

export function reformat(image: sharp.Sharp, format: keyof FormatEnum | AvailableFormatInfo) {
	image.toFormat(format);
}

export function grayscale(image: sharp.Sharp) {
	image.grayscale();
}

export function flip(image: sharp.Sharp) {
	image.flip();
}

export function flop(image: sharp.Sharp) {
	image.flop();
}

export function negate(image: sharp.Sharp) {
	image.negate();
}

export function tint(image: sharp.Sharp, r: number, g: number, b: number) {
	image.tint({ r, g, b });
}
