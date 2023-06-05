import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Card } from "@/components/ui/Card";
import Logo from "@/components/ui/Logo";
import { Input } from "@/components/ui/Input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
	email: z.string().nonempty({ message: "Required" }).email(),
	password: z.string().nonempty({ message: "Required" }),
});
type Inputs = z.infer<typeof schema>;

export default function SignIn() {
	const form = useForm<Inputs>({ resolver: zodResolver(schema) });
	const onSubmit: SubmitHandler<Inputs> = (data) => {};

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
