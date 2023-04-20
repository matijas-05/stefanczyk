import { Tag } from "./tagModel";

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
	tags: Tag[];
}

const images: Image[] = [];

export function getAll() {
	return images;
}

export function get(id: number) {
	return images.find((image) => image.id === id);
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

export function addTag(imageId: number, tag: Omit<Tag, "id">) {
	const image = get(imageId);
	if (image?.tags.filter((t) => t.name === tag.name).length! > 0) {
		throw new Error("Tag already exists");
	}

	if (image) {
		image.tags.push({ id: image.tags.length, ...tag });
	}
}

export function addTags(imageId: number, tags: Omit<Tag, "id">[]) {
	for (const tags of images.map((image) => image.tags)) {
		for (const tag of tags) {
			if (tags.filter((t) => t.name === tag.name).length! > 0) {
				throw new Error("Tag already exists");
			}
		}
	}

	for (const tag of tags) {
		addTag(imageId, tag);
	}
}

export function getTags(imageId: number) {
	const image = get(imageId);
	if (image) {
		return image.tags;
	}
}
