import { User } from "../models/userModel";
import * as userModel from "../models/userModel";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function register(user: User) {
	const hashed = await bcrypt.hash(user.password, 10);
	user.password = hashed;
	user.confirmed = false;

	const token = jwt.sign(
		{ email: user.email } satisfies userModel.JwtPayload,
		process.env.JWT_SECRET!,
		{ expiresIn: "1h" }
	);

	try {
		userModel.add(user);
		return token;
	} catch (error) {
		throw error;
	}
}

export function confirm(token: string) {
	const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

	const user = userModel.get(payload.email);
	if (!user) {
		throw new Error("User not found");
	}

	user.confirmed = true;
	userModel.update(user);
}

export async function login(email: string, password: string) {
	const user = userModel.get(email);
	if (user && user.confirmed === false) {
		throw new Error("User not confirmed");
	}

	const match = await bcrypt.compare(password, user?.password ?? "");
	if (!match) {
		throw new Error("Credentials invalid");
	}

	const token = jwt.sign(
		{ email: user!.email } satisfies userModel.JwtPayload,
		process.env.JWT_SECRET as string,
		{ expiresIn: "1d" }
	);

	return token;
}

export function verifyToken(token: string): JwtPayload | null {
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
		return payload;
	} catch (error) {
		return null;
	}
}
