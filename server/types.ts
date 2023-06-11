import type { User } from "./app/models/userModel";
import type { Post as PostType } from "./app/models/postModel";
import type { Tag as TagType } from "./app/models/tagModel";

export type Profile = Omit<User, "password" | "confirmed">;
export type Post = Omit<PostType, "user" | "tags" | "lastChange"> & {
	user: Profile;
	tags: TagType[];
	lastChange: string;
	_id: string;
};
export type Tag = TagType;
