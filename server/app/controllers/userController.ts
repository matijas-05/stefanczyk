import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel, type JwtPayload, type User } from "../models/userModel";

const loggedOutTokens: string[] = [];

export async function register(user: Omit<User, "confirmed">) {
	const hashed = await bcrypt.hash(user.password, 10);
	const token = jwt.sign({ email: user.email } satisfies JwtPayload, process.env.JWT_SECRET!, {
		expiresIn: "1h",
	});

	if (await UserModel.findOne({ email: user.email })) {
		throw new Error("User already exists");
	}

	await UserModel.create({
		name: user.name,
		lastName: user.lastName,
		email: user.email,
		password: hashed,
		confirmed: false,
	});
	return token;
}

export async function confirm(token: string) {
	const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

	const user = await UserModel.findOne({ email: payload.email });
	if (!user) {
		throw new Error("User not found");
	}

	await UserModel.updateOne({ email: payload.email }, { confirmed: true });
}

export async function login(email: string, password: string) {
	const user = await UserModel.findOne({ email });
	if (user && user.confirmed === false) {
		throw new Error("not_confirmed");
	}

	const match = await bcrypt.compare(password, user?.password ?? "");
	if (!match) {
		throw new Error("credentials");
	}

	const token = jwt.sign(
		{ email: user!.email } satisfies JwtPayload,
		process.env.JWT_SECRET as string,
		{ expiresIn: "1d" }
	);

	return token;
}

export async function logout(email: string, token: string) {
	const user = await UserModel.findOne({ email });
	if (!user) {
		throw new Error("User not found");
	}

	loggedOutTokens.push(token);
}

export function verifyToken(token: string): JwtPayload | null {
	if (loggedOutTokens.includes(token)) {
		return null;
	}

	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
		return payload;
	} catch (error) {
		return null;
	}
}
