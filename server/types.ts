import type { User } from "./app/models/userModel";
import type { Post as PostType } from "./app/models/postModel";

export type Profile = Omit<User, "password" | "confirmed">;
export type Post = Omit<PostType, "user" | "tags"> & { user: Profile; tags: string[] };
