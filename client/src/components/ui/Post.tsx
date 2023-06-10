import { Link, useNavigate } from "react-router-dom";
import type { Post } from "@server/types";
import { Card } from "./Card";
import { ProfilePicture } from "./Avatar";
import { Separator } from "./Separator";
import { TypographySmall } from "./Typography";
import Carousel from "./Carousel";
import React from "react";
import { cn } from "@/lib/utils";

interface Props extends React.ComponentPropsWithoutRef<typeof Card> {
	data: Post;
}

export default function Post({ data, className, ...props }: Props) {
	const navigate = useNavigate();

	return (
		<Card className={cn("flex w-full flex-col gap-3 p-4", className)} {...props}>
			<span className="flex items-center gap-3">
				<ProfilePicture user={data.user} />
				<Link to={`/profile/${data.user.username}`}>
					<TypographySmall>{data.user.username}</TypographySmall>
				</Link>
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
