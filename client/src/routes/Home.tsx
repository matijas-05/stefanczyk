import { useQuery } from "@tanstack/react-query";
import type { Image } from "@server/types";

export default function Home() {
	const { data: images } = useQuery<Image[]>(
		["images"],
		() =>
			fetch("http://localhost:3001/api/photos", {
				method: "GET",
				credentials: "include",
			}).then((res) => res.json()),
		{ suspense: true }
	);

	return (
		<div className="flex flex-col items-center gap-4">
			{images?.map((image, i) => (
				<img
					key={i}
					src={"http://localhost:3001/api/" + image.url}
					className="w-[25rem] transition-all hover:scale-[102%] hover:shadow-xl"
				/>
			))}
		</div>
	);
}
