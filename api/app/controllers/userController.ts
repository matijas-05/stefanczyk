import { User } from "../models/userModel";
import * as userModel from "../models/userModel";
import bcrypt from "bcrypt";

export async function register(user: User) {
	const hashed = await bcrypt.hash(user.password, 10);
	user.password = hashed;
	user.confirmed = false;

	try {
		userModel.add(user);
	} catch (error) {
		throw error;
	}
}
