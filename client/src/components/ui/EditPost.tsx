import * as React from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./Form";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/Dialog";
import { Textarea } from "./Textarea";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./Button";
import type { Post } from "@server/types";

interface Inputs {
	description: string;
	tags: string;
}

interface Props {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	post: Post;
}

export default function EditPost(props: Props) {
	const queryClient = useQueryClient();
	const mutation = useMutation(
		(inputs: Inputs | { tags: string[] }) =>
			fetch(`/api/photos/${props.post._id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(inputs),
			}),
		{
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["posts"] });
				queryClient.invalidateQueries({ queryKey: [props.post._id] });
			},
		}
	);

	const form = useForm<Inputs>({
		defaultValues: React.useMemo(
			() => ({
				description: props.post.description,
				tags: props.post.tags.map((tag) => tag.name).join(" "),
			}),
			[props.post]
		),
	});
	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		if (data.tags) {
			const tags = data.tags.trim().includes(" ") ? data.tags.trim().split(" ") : [data.tags];
			await mutation.mutateAsync({ ...data, tags: data.tags !== "" ? tags : [] });
			props.onOpenChange(false);
			return;
		}

		await mutation.mutateAsync(data);
		props.onOpenChange(false);
	};

	React.useEffect(() => {
		form.reset({
			description: props.post.description,
			tags: props.post.tags.map((tag) => tag.name).join(" "),
		});
	}, [props.post, form]);

	return (
		<Dialog open={props.open} onOpenChange={props.onOpenChange}>
			<DialogTrigger asChild></DialogTrigger>

			<DialogContent className="w-fit">
				<DialogHeader>
					<DialogTitle>Edit post</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form
						className="flex w-80 flex-col gap-2"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											className="w-full rounded border p-2"
											minRows={3}
											maxRows={10}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="tags"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tags</FormLabel>
									<FormControl>
										<Textarea
											className="w-full rounded border p-2"
											minRows={2}
											maxRows={5}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
							rules={{
								pattern: {
									value: /^(#\w+\s*)+$/,
									message: "Tags must be in the format: #tag1 #tag2 #tag3",
								},
							}}
						/>

						<DialogFooter className="mt-2">
							<Button className="w-full" type="submit" loading={mutation.isLoading}>
								Save
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
