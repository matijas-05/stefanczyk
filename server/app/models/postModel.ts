import mongoose from "mongoose";
import type { FilterName } from "./filterModel";

export interface Post {
	user: mongoose.Schema.Types.ObjectId;
	images: string[];
	description: string;
	lastChange: Date;
	history: ImageHistory[];
	tags: mongoose.Schema.Types.ObjectId[];
}
export interface ImageHistory {
	status: "original" | "edited" | "deleted" | FilterName;
	timestamp: Date;
}

const postHistorySchema = new mongoose.Schema<ImageHistory>({
	status: { type: String, required: true },
	timestamp: { type: Date, required: true },
});
const postSchema = new mongoose.Schema<Post>({
	user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
	images: { type: [String], required: true },
	description: { type: String, required: true },
	history: { type: [postHistorySchema], required: true },
	lastChange: { type: Date, required: true },
	tags: { type: [mongoose.Schema.Types.ObjectId], required: true, ref: "Tag" },
});

export const PostModel = mongoose.model<Post>("Post", postSchema);
