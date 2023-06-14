import type { User } from "./app/models/userModel";
import type { Post as PostType } from "./app/models/postModel";
import type { Tag as TagType } from "./app/models/tagModel";
import type { filterNames } from "./app/models/filterModel";

export type Profile = Omit<User, "password" | "confirmed">;
export type Post = Omit<PostType, "user" | "tags" | "lastChange"> & {
	_id: string;
	user: Profile;
	tags: TagType[];
	lastChange: string;
};
export type Tag = TagType;
export type FilterName = (typeof filterNames)[number];
