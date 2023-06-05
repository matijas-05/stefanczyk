import { Card } from "@/components/ui/Card";
import Logo from "@/components/ui/Logo";
import { Input } from "@/components/ui/Input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/Form";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z
	.object({
		email: z.string().nonempty().email(),
		username: z.string().nonempty(),
		password: z
			.string()
			.min(6, { message: "Password must be at least 6 characters long" })
			.regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
			.regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
			.regex(/[0-9]/, { message: "Password must contain at least one number" }),
		repeatPassword: z.string(),
	})
	.refine((data) => data.password === data.repeatPassword, {
		path: ["repeatPassword"],
		message: "Passwords do not match",
	});
type Inputs = z.infer<typeof schema>;

export default function SignIn() {
	const form = useForm<Inputs>({ resolver: zodResolver(schema) });
	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		console.log(data);
	};

	return (
		<div className="m-8 mx-auto w-fit space-y-2">
			<Card className="flex flex-col items-center gap-4 p-8">
				<Logo />

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
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input type="text" placeholder="Username" {...field} />
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
						<FormField
							control={form.control}
							name="repeatPassword"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											type="password"
											placeholder="Repeat Password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button className="mt-2 w-full" type="submit">
							Sign Up
						</Button>
					</Form>
				</form>
			</Card>
			<Card className="px-4 py-2 text-center text-sm">
				Have an account?{" "}
				<Button variant={"link"} asChild>
					<Link to={"/signin"}>Sign in</Link>
				</Button>
			</Card>
		</div>
	);
}
