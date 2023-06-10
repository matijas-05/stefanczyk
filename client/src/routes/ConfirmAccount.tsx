import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Logo from "@/components/ui/Logo";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

export default function ConfirmAccount() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const mutation = useMutation((token: string) =>
		fetch("/api/user/confirm/" + token, {
			method: "GET",
		})
	);

	const onSubmit = async () => {
		const res = await mutation.mutateAsync(searchParams.get("token") ?? "");
		if (res.ok) {
			navigate("/signin", { replace: true });
		}
	};

	return (
		<div className="mx-auto w-fit space-y-2 p-8">
			<Card className="flex flex-col items-center gap-4 p-8">
				<Logo />
				<Button className="w-full" onClick={onSubmit} loading={mutation.isLoading}>
					Confirm Account
				</Button>
			</Card>
		</div>
	);
}
