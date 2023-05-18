import sharp from "sharp";

export function crop(image: sharp.Sharp, region: sharp.Region) {
	image.extract(region);
}
