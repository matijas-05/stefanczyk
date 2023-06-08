import mongoose from "mongoose";
import type { FilterName } from "./filterModel";
import type { Tag } from "./tagModel";

export interface ImageHistory {
	status: "original" | "edited" | "deleted" | FilterName;
	timestamp: Date;
}
export interface Image {
	user: mongoose.Schema.Types.ObjectId;
	url: String;
	lastChange: Date;
	history: ImageHistory[];
	tags: Tag[];
}

const imageHistorySchema = new mongoose.Schema<ImageHistory>({
	status: { type: String, required: true },
	timestamp: { type: Date, required: true },
});
const imageSchema = new mongoose.Schema<Image>({
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	url: { type: String, required: true },
	lastChange: { type: Date, required: true },
	history: { type: [imageHistorySchema], required: true },
	tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag", required: true }],
});
export const ImageModel = mongoose.model<Image>("Image", imageSchema);
