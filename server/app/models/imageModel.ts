import mongoose from "mongoose";
import type { FilterName } from "./filterModel";
import type { Tag } from "./tagModel";

interface ImageHistory {
	status: "original" | "edited" | "deleted" | FilterName;
	timestamp: Date;
	url?: string;
}
interface Image {
	user: mongoose.Schema.Types.ObjectId;
	originalName: string;
	imageUrl: String;
	lastChange: Date;
	history: ImageHistory[];
	tags: Tag[];
}

const imageHistorySchema = new mongoose.Schema<ImageHistory>({
	status: { type: String, required: true },
	timestamp: { type: Date, required: true },
	url: { type: String, required: true },
});
const imageSchema = new mongoose.Schema<Image>({
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	originalName: { type: String },
	imageUrl: { type: String },
	lastChange: { type: Date },
	history: { type: [imageHistorySchema] },
	tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
});
export const ImageModel = mongoose.model<Image>("Image", imageSchema);

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

export function updateHistory(id: number, historyEntry: ImageHistory) {
	const image = get(id);
	if (image) {
		image.history.push(historyEntry);
	}
}
