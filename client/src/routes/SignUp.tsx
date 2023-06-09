import { Card } from "@/components/ui/Card";
import Logo from "@/components/ui/Logo";
import { Input } from "@/components/ui/Input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/Form";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

const schema = z
	.object({
		email: z.string().nonempty({ message: "Required" }).email(),
		name: z.string().nonempty({ message: "Required" }),
		lastName: z.string().nonempty({ message: "Required" }),
		password: z
			.string()
			.min(6, { message: "Password must be at least 6 characters long" })
			.regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
			.regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
			.regex(/[0-9]/, { message: "Password must contain at least one number" }),
		repeatPassword: z.string().nonempty({ message: "Required" }),
	})
	.refine((data) => data.password === data.repeatPassword, {
		path: ["repeatPassword"],
		message: "Passwords do not match",
	});
type Inputs = z.infer<typeof schema>;

export default function SignIn() {
	const mutation = useMutation((data: Inputs) => {
		return fetch("http://localhost:3001/api/user/register", {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
			},
		});
	});
	const navigate = useNavigate();

	const form = useForm<Inputs>({ resolver: zodResolver(schema) });
	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		try {
			const res = await mutation.mutateAsync(data);

			if (res.status === 409) {
				form.setError("email", {
					type: "manual",
					message: "User with this email already exists",
				});
			} else if (res.ok) {
				const { token } = await res.json();
				navigate("/confirm?token=" + token, { replace: true });
			} else throw Error();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="mx-auto w-fit space-y-2 p-8">
			<Card className="flex flex-col items-center gap-4 p-8">
				<Logo />

				<form onSubmit={form.handleSubmit(onSubmit)} className="flex w-80 flex-col gap-2">
					<Form {...form}>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="user@domain.com"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex gap-2">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input type="text" placeholder="John" {...field} />
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
											<Input type="text" placeholder="Doe" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input type="password" placeholder="******" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="repeatPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Repeat password</FormLabel>
									<FormControl>
										<Input type="password" placeholder="******" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button className="mt-2 w-full" type="submit" loading={mutation.isLoading}>
							Sign Up
						</Button>
					</Form>
				</form>
			</Card>

			<Card className="px-4 py-2 text-center text-sm">
				Have an account?{" "}
				<Button variant={"link"} type="submit" asChild>
					<Link to={"/signin"}>Sign in</Link>
				</Button>
			</Card>
		</div>
	);
}
