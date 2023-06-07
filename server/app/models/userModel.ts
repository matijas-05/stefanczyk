export interface User {
	id: number;
	name: string;
	lastName: string;
	email: string;
	password: string;
	confirmed: boolean;
	profilePicture?: string;
}
export interface JwtPayload {
	email: string;
}

const users: User[] = [];

export function add(user: Omit<User, "id">) {
	if (users.find((x) => user.email === x.email)) {
		throw new Error("User already exists");
	}

	users.push({ ...user, id: users.length + 1 });
}

export function get(email: string) {
	return users.find((user) => user.email === email);
}

export function update(user: User) {
	const index = users.findIndex((u) => u.email === user.email);
	if (index === -1) {
		throw new Error("User not found");
	}

	users[index] = user;
}
