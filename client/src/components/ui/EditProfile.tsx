import * as React from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import type { Profile } from "@server/types";
import { Button } from "@/components/ui/Button";
import Dropzone from "@/components/ui/Dropzone";
import { cn } from "@/lib/utils";
import { useDropzone } from "react-dropzone";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./Dialog";

interface Inputs {
	username: string;
	name: string;
	lastName: string;
	photo?: File;
	filters?: string[];
}
const regex = /^\S+$/;

interface Props {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	profile: Profile;
}

export default function EditProfileDialog(props: Props) {
	const queryClient = useQueryClient();
	const updateDetails = useMutation(
		(data: Inputs) =>
			fetch("/api/user/profile", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			}),
		{
			onSuccess: () =>
				props.profile.username === form.getValues().username &&
				queryClient.invalidateQueries({ queryKey: [props.profile.username] }),
		}
	);
	const updatePicture = useMutation(
		(data: FormData) =>
			fetch("/api/user/profile", {
				method: "POST",
				body: data,
			}),
		{
			onSuccess: () => {
				if (props.profile.username === form.getValues().username) {
					queryClient.invalidateQueries({ queryKey: [props.profile.username] });
					queryClient.invalidateQueries({ queryKey: ["profile"] });
				}
			},
		}
	);

	const form = useForm<Inputs>({
		defaultValues: React.useMemo(() => props.profile, [props.profile]),
	});
	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		const res = await updateDetails.mutateAsync(data);
		if (res.status === 409) {
			form.setError("username", {
				message: "This username is already taken",
			});
			return;
		}

		if (data.photo) {
			const formData = new FormData();
			formData.set("photo", data.photo);
			await updatePicture.mutateAsync(formData);
			form.resetField("photo");
		}

		props.onOpenChange(false);
		if (props.profile.username !== data.username) {
			window.location.pathname = `/profile/${data.username}`;
		}
	};

	const dropzone = useDropzone({
		onDropAccepted: (files) => {
			form.setValue("photo", files[0]);
		},
		accept: {
			"image/*": [],
		},
	});

	React.useEffect(() => {
		form.reset(props.profile);
	}, [props.profile, form]);

	return (
		<Dialog open={props.open} onOpenChange={props.onOpenChange}>
			<DialogContent className="w-fit">
				<DialogHeader>
					<DialogTitle>Edit profile</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex w-64 flex-col gap-2"
					>
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input type="text" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
							rules={{
								pattern: {
									value: /^[a-zA-Z0-9_]+$/,
									message:
										"Username must contain only letters, numbers and underscores",
								},
							}}
						/>

						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input type="text" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
							rules={{
								required: "Required",
								pattern: {
									value: regex,
									message: "No spaces allowed",
								},
							}}
						/>
						<FormField
							control={form.control}
							name="lastName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Last name</FormLabel>
									<FormControl>
										<Input type="text" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
							rules={{
								required: "Required",
								pattern: {
									value: regex,
									message: "No spaces allowed",
								},
							}}
						/>

						<FormField
							control={form.control}
							name="photo"
							render={() => (
								<FormItem>
									<FormLabel>Profile picture</FormLabel>
									<FormControl>
										<Dropzone
											className={cn(
												"w-full",
												dropzone.isDragActive && "border-ring"
											)}
											dropzone={dropzone}
											files={
												form.getValues("photo")
													? [form.getValues("photo") as File]
													: []
											}
											setFiles={(files) => form.setValue("photo", files[0])}
											filters={form.getValues("filters") ?? [""]}
											setFilters={(filters) => {
												form.setValue("filters", filters);
												form.trigger("filters");
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							className="mt-2"
							type="submit"
							loading={updateDetails.isLoading || updatePicture.isLoading}
						>
							Save
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
