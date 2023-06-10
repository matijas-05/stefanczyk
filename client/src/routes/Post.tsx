import { useParams } from "react-router-dom";
import PostComp from "@/components/ui/Post";
import { useQuery } from "@tanstack/react-query";
import type { Post } from "@server/types";

export default function Post() {
	const postId = useParams().post;
	const { data } = useQuery<Post>(
		[""],
		() => fetch("/api/photos/" + postId).then((res) => res.json()),
		{ suspense: true, cacheTime: 0 }
	);

	return <PostComp data={data!} className="mx-auto w-1/2 max-w-xl" />;
}
