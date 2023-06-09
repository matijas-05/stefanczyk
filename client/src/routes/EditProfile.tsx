import * as React from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/Form";
import { TypographyH2 } from "@/components/ui/Typography";
import { Input } from "@/components/ui/Input";
import type { Profile } from "@server/types";
import { Button } from "@/components/ui/Button";
import Dropzone from "@/components/ui/Dropzone";
import { cn } from "@/lib/utils";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/Card";

interface Inputs {
	name: string;
	lastName: string;
	photo?: File;
}
const regex = /^\S+$/;

export default function EditProfile() {
	const queryClient = useQueryClient();

	const { data } = useQuery<Profile>(["profile"], () =>
		fetch("http://localhost:3001/api/user/profile", {
			method: "GET",
			credentials: "include",
		}).then((res) => res.json())
	);
	const updateDetails = useMutation(
		(data: Inputs) =>
			fetch("http://localhost:3001/api/user/profile", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
				credentials: "include",
			}),
		{ onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }) }
	);
	const updatePicture = useMutation(
		(data: FormData) =>
			fetch("http://localhost:3001/api/user/profile", {
				method: "POST",
				credentials: "include",
				body: data,
			}),
		{ onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }) }
	);

	const form = useForm<Inputs>({
		defaultValues: React.useMemo(() => data, [data]),
	});
	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		await updateDetails.mutateAsync(data);

		if (data.photo) {
			const formData = new FormData();
			formData.set("photo", data.photo);
			await updatePicture.mutateAsync(formData);
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
		form.reset(data);
	}, [data, form]);

	return (
		<div className="grid place-content-center">
			<TypographyH2 className="mb-4">Edit profile</TypographyH2>

			<Card className="w-fit p-4">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex w-64 flex-col gap-2"
					>
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
			</Card>
		</div>
	);
}
