import type { User } from "./app/models/userModel";
import type { Post as PostType } from "./app/models/postModel";
import type { Tag as TagType } from "./app/models/tagModel";

export type Profile = Omit<User, "password" | "confirmed">;
export type Post = Omit<PostType, "user" | "tags"> & {
	user: Profile;
	tags: TagType[];
	_id: string;
};
export type Tag = TagType;
