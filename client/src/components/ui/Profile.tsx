import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./Avatar";
import type { Profile } from "@server/types";
import { Button } from "./Button";

export default function Profile({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
	const { data: user } = useQuery<Profile>(
		["profile"],
		() =>
			fetch("http://localhost:3001/api/user/profile", {
				method: "GET",
				credentials: "include",
			}).then((res) => res.json()),
		{ refetchOnWindowFocus: false }
	);
	const logOut = useMutation(() =>
		fetch("http://localhost:3001/api/user/logout", {
			method: "GET",
			credentials: "include",
		})
	);
	const navigate = useNavigate();

	return (
		<div className={cn("flex items-center gap-5", className)} {...props}>
			<Avatar>
				{user?.profilePicture && (
					<AvatarImage src={"http://localhost:3001/api/" + user.profilePicture} />
				)}
				<AvatarFallback>
					{user?.name.charAt(0).toLocaleUpperCase()}
					{user?.lastName.charAt(0).toLocaleUpperCase()}
				</AvatarFallback>
			</Avatar>

			<Button
				variant={"link"}
				className="text-base"
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
