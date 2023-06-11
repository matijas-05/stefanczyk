import { ProfilePicture } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { TypographySmall } from "@/components/ui/Typography";
import type { Post } from "@server/types";
import { useQuery } from "@tanstack/react-query";
import { Layers } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function Profile() {
	const username = useParams<{ username: string }>().username;
	const { data: posts } = useQuery<Post[]>(
		["user-posts"],
		() => fetch(`/api/photos/user/${username}`).then((res) => res.json()),
		{ suspense: true, cacheTime: 0 }
	);

	const navigate = useNavigate();

	return (
		<Card className="mx-auto flex w-[50vw] flex-col gap-4 p-4">
			<div className="flex items-center gap-3">
				<ProfilePicture user={posts![0].user} />
				<TypographySmall>{username}</TypographySmall>
			</div>

			<Separator />

			<div className="flex flex-wrap gap-4">
				{posts!.map((post, i) => (
					<div key={i} className="relative">
						<img
							className="h-32 w-32 cursor-pointer rounded object-cover"
							src={`/api/${post.images[0]}`}
							alt={post.description}
							onClick={() => navigate(`/post/${post._id}`)}
						/>
						{post.images.length > 1 && (
							<Layers className="absolute right-1.5 top-1.5 w-5 text-white" />
						)}
					</div>
				))}
			</div>
		</Card>
	);
}
