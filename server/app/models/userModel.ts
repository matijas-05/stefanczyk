import mongoose from "mongoose";

export interface User {
	name: string;
	lastName: string;
	email: string;
	password: string;
	confirmed: boolean;
	profilePicture?: string;
}
const userSchema = new mongoose.Schema<User>({
	name: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	confirmed: { type: Boolean, required: true },
	profilePicture: { type: String },
});
export const UserModel = mongoose.model("User", userSchema);

export interface JwtPayload {
	email: string;
}
