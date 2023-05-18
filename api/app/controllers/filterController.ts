import sharp, { AvailableFormatInfo, FormatEnum } from "sharp";

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
