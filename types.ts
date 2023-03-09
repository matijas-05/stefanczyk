export interface Message {
	username: string;
	message: string;
	type: "message" | "info";
}

export interface ClientToServerEvents {
	userJoined: (username: string) => void;
	message: (message: Message) => void;
	getMessages: () => void;
}
export type ServerToClientEvents = {
	userJoined: (username: string) => void;
	message: (message: Message) => void;
	getMessages: (messages: Message[]) => void;
};
