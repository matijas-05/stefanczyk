import { ProfilePicture } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import EditProfileDialog from "@/components/ui/EditProfile";
import { Separator } from "@/components/ui/Separator";
import type { Post, Profile } from "@server/types";
import { useQuery } from "@tanstack/react-query";
import { Layers } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function Profile() {
	const navigate = useNavigate();
	const location = useLocation();
	const username = useParams<{ username: string }>().username;

	const posts = useQuery<Post[]>(
		["user-posts"],
		() => fetch(`/api/photos/user/${username}`).then((res) => res.json()),
		{ suspense: true, cacheTime: 0 }
	);
	const postUser = posts.data![0].user;

	const { data: currentUser } = useQuery<Profile>(
		["profile"],
		() => fetch("/api/user/profile").then((res) => res.json()),
		{ refetchOnWindowFocus: false, suspense: true }
	);

	const [editProfile, setEditProfile] = useState(false);
	useEffect(() => {
		posts.refetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location]);

	return (
		<>
			<Card className="mx-auto flex w-[50vw] flex-col gap-8 p-6">
				<div className="flex items-center gap-8">
					<ProfilePicture className="h-36 w-36 text-5xl" user={postUser} />

					<div className="flex flex-col gap-4">
						<span className="flex items-center gap-4 text-2xl">
							{postUser.username}
							{currentUser?.username === postUser.username && (
								<Button variant={"secondary"} onClick={() => setEditProfile(true)}>
									Edit profile
								</Button>
							)}
						</span>
						<p className="font-medium">
							{postUser.name} {postUser.lastName}
						</p>
					</div>
				</div>

				<Separator />

				<div className="flex flex-wrap gap-4">
					{posts.data!.map((post, i) => (
						<div key={i} className="relative">
							<img
								className="h-32 w-32 cursor-pointer rounded object-cover"
								src={`/api/${post.images[0]}`}
								alt={post.description}
								onClick={() => navigate(`/post/${post._id}`)}
							/>
							{post.images.length > 1 && (
								<Layers className="pointer-events-none absolute right-1.5 top-1.5 w-5 text-white" />
							)}
						</div>
					))}
				</div>
			</Card>

			<EditProfileDialog
				open={editProfile}
				onOpenChange={setEditProfile}
				profile={currentUser!}
			/>
		</>
	);
}
