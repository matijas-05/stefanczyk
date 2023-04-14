interface ImageHistory {
	status: "original" | "edited" | "deleted";
	timestamp: Date;
}
export interface Image {
	id: number;
	album: string;
	originalName: string;
	url: string;
	lastChange: Date;
	history: ImageHistory[];
}

const images: Image[] = [];

export function getAll(): Image[] {
	return images;
}
export function add(image: Image) {
	images.push(image);
}
