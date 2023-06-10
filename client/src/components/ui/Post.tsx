import { Link, useLocation, useNavigate } from "react-router-dom";
import type { Post, Profile } from "@server/types";
import { Card } from "./Card";
import { ProfilePicture } from "./Avatar";
import { Separator } from "./Separator";
import { TypographySmall } from "./Typography";
import Carousel from "./Carousel";
import React from "react";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { Button } from "./Button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Props extends React.ComponentPropsWithoutRef<typeof Card> {
	data: Post;
}

export default function Post({ data, className, ...props }: Props) {
	const navigate = useNavigate();
	const location = useLocation();

	const queryClient = useQueryClient();
	const { data: currentUser } = useQuery<Profile>(
		["profile"],
		() => fetch("/api/user/profile").then((res) => res.json()),
		{ refetchOnWindowFocus: false }
	);
	const deleteMutation = useMutation(
		() => fetch(`/api/photos/${data._id}`, { method: "DELETE", credentials: "include" }),
		{ onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }) }
	);

	return (
		<Card className={cn("flex w-full flex-col gap-3 p-4", className)} {...props}>
			<span className="flex items-center gap-3">
				<ProfilePicture user={data.user} />
				<Link to={`/profile/${data.user.username}`}>
					<TypographySmall>{data.user.username}</TypographySmall>
				</Link>

				{currentUser?.username === data.user.username && (
					<Button
						variant={"link"}
						className="ml-auto w-6"
						icon={<Trash2 className="text-destructive" />}
						loading={deleteMutation.isLoading}
						onClick={async () => {
							await deleteMutation.mutateAsync();
							if (location.pathname.startsWith("/post")) {
								navigate("/");
							}
						}}
					/>
				)}
			</span>
			<Separator />

			{data.images.length === 1 ? (
				<img
					className="cursor-pointer rounded-sm object-contain"
					src={`/api/${data.images[0]}`}
					onClick={() => navigate(`/post/${data._id}`)}
				/>
			) : (
				<Carousel
					imageUrls={data.images.map((image) => `/api/${image}`)}
					postId={data._id}
				/>
			)}
			<Separator />

			<TypographySmall className="font-normal">{data.description}</TypographySmall>
		</Card>
	);
}
