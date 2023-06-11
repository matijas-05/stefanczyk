import { useQuery } from "@tanstack/react-query";
import type { Post as PostType } from "@server/types";
import Post from "@/components/ui/Post";
import { TypographyH2 } from "@/components/ui/Typography";

export default function Home() {
	const { data: posts } = useQuery<PostType[]>(
		["posts"],
		() => fetch("/api/photos").then((res) => res.json()),
		{ suspense: true }
	);

	return (
		<div className="flex flex-col items-center gap-4">
			{posts && posts.length > 0 ? (
				posts.map((post, i) => (
					<div key={i} className="flex w-[35rem] overflow-x-auto">
						<Post post={post} />
					</div>
				))
			) : (
				<TypographyH2>No posts</TypographyH2>
			)}
		</div>
	);
}
