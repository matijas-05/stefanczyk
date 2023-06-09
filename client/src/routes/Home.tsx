import { useQuery } from "@tanstack/react-query";
import type { Post } from "@server/types";

export default function Home() {
	const { data: posts } = useQuery<Post[]>(
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
				<div key={i} className="flex w-[25rem] overflow-x-auto">
					{post.images.map((image, i) => (
						<img
							key={i}
							src={"http://localhost:3001/api/" + image}
							className="w-[25rem] object-contain"
						/>
					))}
				</div>
			))}
		</div>
	);
}
