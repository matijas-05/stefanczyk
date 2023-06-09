import { Link } from "react-router-dom";
import type { Post } from "@server/types";
import { Card } from "./Card";
import { ProfilePicture } from "./Avatar";
import { Separator } from "./Separator";
import { TypographySmall } from "./Typography";

interface Props {
	data: Post;
}

export default function Post({ data }: Props) {
	return (
		<Card className="flex flex-col gap-2 p-4">
			<span className="flex items-center gap-3">
				<ProfilePicture user={data.user} />
				<Link to={`/profile/${data.user.username}`}>
					<TypographySmall>{data.user.username}</TypographySmall>
				</Link>
			</span>
			<Separator />

			{data.images.length === 1 ? (
				<img
					className="my-1 rounded-sm object-contain"
					src={`http://localhost:3001/api/${data.images[0]}`}
				/>
			) : null}
			<Separator />

			<div>
				<TypographySmall className="font-normal">{data.description}</TypographySmall>
			</div>
		</Card>
	);
}
