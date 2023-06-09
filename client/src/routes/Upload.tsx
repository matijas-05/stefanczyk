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
import { TypographyH2 } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
	tags: z.array(z.string()).nonempty(),
});
type Inputs = z.infer<typeof schema> & { files: File[] };

export default function Upload() {
	const mutation = useMutation(["posts"], (body: FormData) =>
		fetch("http://localhost:3001/api/photos", { method: "POST", credentials: "include", body })
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
		formData.set("tags", JSON.stringify([]));

		await mutation.mutateAsync(formData);
		form.setValue("files", []);
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
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col items-center gap-2"
					>
						<FormField
							control={form.control}
							name="files"
							render={() => (
								<FormItem>
									<FormControl>
										<Dropzone
											className={cn(
												form.formState.errors.files && "border-destructive",
												dropzone.isDragActive && "border-ring"
											)}
											dropzone={dropzone}
											files={form.getValues("files") || []}
											setFiles={(files) => form.setValue("files", files)}
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
