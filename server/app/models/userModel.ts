import mongoose from "mongoose";

export interface User {
	email: string;
	username: string;
	name: string;
	lastName: string;
	password: string;
	confirmed: boolean;
	profilePicture?: string;
}
const userSchema = new mongoose.Schema<User>({
	email: { type: String, required: true },
	username: { type: String, required: true },
	name: { type: String, required: true },
	lastName: { type: String, required: true },
	password: { type: String, required: true },
	confirmed: { type: Boolean, required: true },
	profilePicture: { type: String },
});
export const UserModel = mongoose.model("User", userSchema);

export interface JwtPayload {
	email: string;
}
