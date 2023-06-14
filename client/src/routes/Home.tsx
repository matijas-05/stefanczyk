import { useQuery } from "@tanstack/react-query";
import type { Post as PostType } from "@server/types";
import Post from "@/components/ui/Post";
import { TypographyH2 } from "@/components/ui/Typography";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export default function Home() {
	const [searchParams] = useSearchParams();
	const query = useQuery<PostType[]>(
		["posts"],
		async () => {
			const res = await fetch("/api/photos");
			const posts = (await res.json()) as PostType[];

			const tagName = searchParams.get("tag");
			if (tagName) {
				return posts.filter(
					(post) => post.tags.filter((tag) => tag.name === tagName).length > 0
				);
			} else {
				return posts;
			}
		},
		{ suspense: true }
	);

	useEffect(() => {
		query.refetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams]);

	return (
		<div className="flex flex-col items-center gap-4">
			{query.data && query.data.length > 0 ? (
				query.data.map((post, i) => (
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
