import type { User } from "./app/models/userModel";

export type Profile = Omit<User, "password" | "confirmed">;
export type { Post } from "./app/models/postModel";
