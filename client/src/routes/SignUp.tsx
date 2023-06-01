import { Card } from "@/components/ui/Card";
import Logo from "@/components/ui/Logo";
import { Input } from "@/components/ui/Input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/Form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Link } from "react-router-dom";

const schema = z.object({
	email: z.string().nonempty().email(),
	password: z.string().min(6),
});
type Inputs = z.infer<typeof schema>;

export default function SignIn() {
	const form = useForm<Inputs>();

	return (
		<div className="m-8 mx-auto w-fit space-y-2">
			<Card className="flex flex-col items-center gap-4 p-8">
				<Logo />

				<form className="flex flex-col gap-2">
					<Form {...form}>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input type="email" placeholder="Email" {...field} />
									</FormControl>
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
