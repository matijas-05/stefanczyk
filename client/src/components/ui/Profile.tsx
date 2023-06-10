import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Profile } from "@server/types";
import { Button } from "./Button";

export default function Profile({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
	const logOut = useMutation(() =>
		fetch("/api/user/logout", {
			method: "GET",
			credentials: "include",
		})
	);
	const navigate = useNavigate();

	return (
		<div className={cn("flex items-center gap-5", className)} {...props}>
			<Button
				variant={"ghost"}
				className="text-base text-primary hover:text-primary"
				icon={<LogOut className="w-5" />}
				onClick={async () => {
					await logOut.mutateAsync();
					return navigate("/signin");
				}}
			>
				Sign out
			</Button>
		</div>
	);
}
