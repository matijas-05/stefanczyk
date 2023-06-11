import { Link, useNavigate } from "react-router-dom";
import type { Post, Profile } from "@server/types";
import { Card } from "./Card";
import { ProfilePicture } from "./Avatar";
import { Separator } from "./Separator";
import { TypographySmall } from "./Typography";
import Carousel from "./Carousel";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "./Button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/AlertDialog";
import EditPost from "./EditPost";

interface Props extends React.ComponentPropsWithoutRef<typeof Card> {
	post: Post;
}

export default function Post({ post, className, ...props }: Props) {
	const navigate = useNavigate();

	const queryClient = useQueryClient();
	const { data: currentUser } = useQuery<Profile>(
		["profile"],
		() => fetch("/api/user/profile").then((res) => res.json()),
		{ refetchOnWindowFocus: false }
	);

	const deleteMutation = useMutation(
		() => fetch(`/api/photos/${post._id}`, { method: "DELETE" }),
		{ onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }) }
	);

	const [deleteDialog, setDeleteDialog] = useState(false);
	const [editDialog, setEditDialog] = useState(false);

	return (
		<Card className={cn("flex w-full flex-col gap-3 p-4", className)} {...props}>
			<span className="flex items-center gap-3">
				<ProfilePicture user={post.user} />
				<Link to={`/profile/${post.user.username}`}>
					<TypographySmall>{post.user.username}</TypographySmall>
				</Link>

				{currentUser?.username === post.user.username && (
					<div className="ml-auto flex gap-2">
						<Button
							variant={"link"}
							className="w-5"
							icon={<Edit />}
							onClick={() => setEditDialog(true)}
						/>
						<EditPost open={editDialog} onOpenChange={setEditDialog} post={post} />

						<AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
							<AlertDialogTrigger asChild>
								<Button
									variant={"link"}
									className="ml-auto w-5"
									icon={<Trash2 className="text-destructive" />}
									loading={deleteMutation.isLoading}
								/>
							</AlertDialogTrigger>

							<AlertDialogContent className="w-fit">
								<AlertDialogHeader>
									<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
									<AlertDialogDescription>
										This will permanently delete the post. This action cannot be
										undone.
									</AlertDialogDescription>
								</AlertDialogHeader>

								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<Button
										className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
										variant={"destructive"}
										onClick={async () => {
											await deleteMutation.mutateAsync();
											if (window.location.pathname.startsWith("/post")) {
												navigate(-1);
											}
											setDeleteDialog(false);
										}}
										loading={deleteMutation.isLoading}
									>
										Delete
									</Button>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				)}
			</span>
			<Separator />

			{post.images.length === 1 ? (
				<img
					className="cursor-pointer rounded-sm object-contain"
					src={`/api/${post.images[0]}`}
					onClick={() => navigate(`/post/${post._id}`)}
				/>
			) : (
				<Carousel
					imageUrls={post.images.map((image) => `/api/${image}`)}
					postId={post._id}
				/>
			)}

			{(post.description || post.tags.length > 0) && (
				<>
					<Separator />
					<div>
						<TypographySmall className="whitespace-pre-line font-normal">
							{post.description}
						</TypographySmall>
						<div className="flex gap-2">
							{post.tags.map((tag, i) => (
								<Link key={i} to={`/search?tags=${encodeURIComponent(tag.name)}`}>
									<TypographySmall>{tag.name}</TypographySmall>
								</Link>
							))}
						</div>
					</div>
				</>
			)}
		</Card>
	);
}
