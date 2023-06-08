import type { User } from "./app/models/userModel";

export type Profile = Omit<User, "password" | "confirmed">;
export type { Image } from "./app/models/imageModel";
