import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Dropzone from "@/components/ui/Dropzone";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/Form";
import { Textarea } from "@/components/ui/Textarea";
import { TypographyH2 } from "@/components/ui/Typography";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";

interface Inputs {
	files: File[];
	description: string;
	tags: string;
}

export default function Upload() {
	const queryClient = useQueryClient();
	const mutation = useMutation(
		(body: FormData) => fetch("/api/photos", { method: "POST", body }),
		{ onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile", "posts"] }) }
	);

	const form = useForm<Inputs>();
	const onSubmit = async (data: Inputs) => {
		if (data.files.length === 0) {
			form.setError("files", {
				type: "manual",
				message: "You must upload at least one photo",
			});
			return;
		}

		const formData = new FormData();
		data.files.forEach((file) => formData.append("photos", file));
		formData.set("description", data.description);

		const tags = data.tags.trim().includes(" ") ? data.tags.trim().split(" ") : [data.tags];
		formData.set("tags", data.tags !== "" ? JSON.stringify(tags) : JSON.stringify([]));

		await mutation.mutateAsync(formData);
		form.reset({ files: [] });
	};

	const dropzone = useDropzone({
		onDropAccepted: (files) => {
			form.setValue("files", [...form.getValues("files"), ...files]);
			form.clearErrors("files");
		},
		accept: {
			"image/*": [],
		},
	});

	return (
		<div className="grid place-content-center">
			<TypographyH2 className="mb-4">Upload a photo</TypographyH2>

			<Card className="w-fit p-4">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
						<FormField
							control={form.control}
							name="files"
							render={() => (
								<FormItem>
									<FormControl>
										<Dropzone
											dropzone={dropzone}
											files={form.getValues("files") || []}
											setFiles={(files) => form.setValue("files", files)}
											error={!!form.formState.errors.files}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
							rules={{ required: "You must upload at least one photo" }}
						/>

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
						/>

						<Button type="submit" className="mt-2 w-full" loading={mutation.isLoading}>
							Upload {mutation.isSuccess && <Check className="mt-px w-4" />}
						</Button>
					</form>
				</Form>
			</Card>
		</div>
	);
}
