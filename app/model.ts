interface ImageHistory {
	status: "original" | "edited" | "deleted";
	timestamp: Date;
}
interface Image {
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

export function remove(image: Image) {
	const index = images.indexOf(image);
	if (index !== -1) {
		images.splice(index, 1);
	}
}

export function update(id: number, image: Partial<Image>) {
	const index = images.findIndex((image) => image.id === id);
	if (index !== -1) {
		images[index] = { ...images[index], ...image };
	}
}
