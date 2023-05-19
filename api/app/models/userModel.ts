export interface User {
	name: string;
	lastName: string;
	email: string;
	password: string;
	confirmed: boolean;
}

const users: User[] = [];

export function add(user: User) {
	if (users.find((user) => user.email === user.email)) {
		throw new Error("User already exists");
	}

	users.push(user);
	console.log(users);
}
