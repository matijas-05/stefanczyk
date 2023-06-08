import mongoose from "mongoose";

export interface Tag {
	id: number;
	name: string;
	popularity: number;
}
const tagSchema = new mongoose.Schema<Tag>({
	name: { type: String, required: true },
	popularity: { type: Number, required: true },
});
export const TagModel = mongoose.model<Tag>("Tag", tagSchema);

const tags: Tag[] = [
	{
		id: 0,
		name: "#javascript",
		popularity: 100,
	},
	{
		id: 1,
		name: "#typescript",
		popularity: 100,
	},
];

export function getAllRaw() {
	return tags.map((tag) => tag.name);
}

export function getAll() {
	return tags;
}

export function get(id: number) {
	return tags.find((tag) => tag.id === id);
}

export function add(tag: Omit<Tag, "id">) {
	if (!tags.find((t) => t.name === tag.name)) {
		tags.push({ id: tags.length, ...tag });
	} else {
		throw new Error("Tag already exists");
	}
}
