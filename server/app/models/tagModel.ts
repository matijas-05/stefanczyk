import mongoose from "mongoose";

export interface Tag {
	_id: number;
	name: string;
	popularity: number;
}
const tagSchema = new mongoose.Schema<Tag>({
	name: { type: String, required: true, unique: true },
	popularity: { type: Number, required: true },
});
export const TagModel = mongoose.model<Tag>("Tag", tagSchema);
