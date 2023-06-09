import { useQuery } from "@tanstack/react-query";
import type { Post as PostType } from "@server/types";
import Post from "@/components/ui/Post";

export default function Home() {
	const { data: posts } = useQuery<PostType[]>(
		["posts"],
		() =>
			fetch("http://localhost:3001/api/photos", {
				method: "GET",
				credentials: "include",
			}).then((res) => res.json()),
		{ suspense: true }
	);

	return (
		<div className="flex flex-col items-center gap-4">
			{posts?.map((post, i) => (
				<div key={i} className="flex w-[35rem] overflow-x-auto">
					<Post data={post} />
				</div>
			))}
		</div>
	);
}
