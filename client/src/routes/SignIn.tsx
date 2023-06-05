import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Card } from "@/components/ui/Card";
import Logo from "@/components/ui/Logo";
import { Input } from "@/components/ui/Input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Alert, AlertTitle } from "@/components/ui/Alert";
import { AlertCircle } from "lucide-react";

const schema = z.object({
	email: z.string().nonempty({ message: "Required" }).email(),
	password: z.string().nonempty({ message: "Required" }),
});
type Inputs = z.infer<typeof schema>;

export default function SignIn() {
	const mutation = useMutation((data: Inputs) =>
		fetch("http://localhost:3001/api/user/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})
	);

	const form = useForm<Inputs>({ resolver: zodResolver(schema) });
	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		const res = await mutation.mutateAsync(data);

		if (res.ok) {
			console.log(await res.json());
		} else {
			if (res.status === 401) {
				form.setError("root", {
					type: "manual",
					message: "Incorrect credentials",
				});
			} else if (res.status === 403) {
				form.setError("root", {
					type: "manual",
					message: "User is not confirmed",
				});
			}
		}
	};

	return (
		<div className="m-8 mx-auto w-fit space-y-2">
			<Card className="flex flex-col items-center gap-4 p-8">
				<Logo />

				{form.formState.errors.root && (
					<Alert variant={"destructive"} icon={<AlertCircle className="w-5" />}>
						<AlertTitle className="!mb-0 text-sm">
							{form.formState.errors.root?.message}
						</AlertTitle>
					</Alert>
				)}

				<form onSubmit={form.handleSubmit(onSubmit)} className="flex w-64 flex-col gap-2">
					<Form {...form}>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input type="email" placeholder="Email" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input type="password" placeholder="Password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button className="mt-2 w-full" type="submit">
							Sign In
						</Button>
					</Form>
				</form>
			</Card>

			<Card className="px-4 py-2 text-center text-sm">
				Don't have an account?{" "}
				<Button variant={"link"} asChild>
					<Link to={"/signup"}>Sign up</Link>
				</Button>
			</Card>
		</div>
	);
}
