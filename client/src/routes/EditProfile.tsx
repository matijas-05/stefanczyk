import * as React from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
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

const regex = /^\S+$/;
const schema = z.object({
	name: z
		.string()
		.nonempty({ message: "Required" })
		.regex(regex, { message: "No spaces allowed" }),
	lastName: z
		.string()
		.nonempty({ message: "Required" })
		.regex(regex, { message: "No spaces allowed" }),
});
type Inputs = z.infer<typeof schema>;

export default function EditProfile() {
	const queryClient = useQueryClient();

	const { data } = useQuery<Profile>(["profile"], () =>
		fetch("http://localhost:3001/api/user/profile", {
			method: "GET",
			credentials: "include",
		}).then((res) => res.json())
	);
	const mutation = useMutation(
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

	const form = useForm<Inputs>({
		defaultValues: React.useMemo(() => data, [data]),
		resolver: zodResolver(schema),
	});
	const onSubmit: SubmitHandler<Inputs> = (data) => mutation.mutate(data);

	React.useEffect(() => {
		form.reset(data);
	}, [data, form]);

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="flex w-64 flex-col gap-2">
			<Form {...form}>
				<TypographyH2 className="mb-4">Edit profile</TypographyH2>

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
				/>

				<Button className="mt-2" type="submit" loading={mutation.isLoading}>
					Save
				</Button>
			</Form>
		</form>
	);
}
