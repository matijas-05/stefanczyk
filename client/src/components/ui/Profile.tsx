import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "./Avatar";
import type { Profile } from "@server/types";
import { Button } from "./Button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";

export default function Profile({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
	const { data: user } = useQuery<Profile>(["profile"], async () =>
		fetch("http://localhost:3001/api/user/profile", {
			method: "GET",
			credentials: "include",
		}).then((res) => res.json())
	);
	const logOut = useMutation(() =>
		fetch("http://localhost:3001/api/user/logout", {
			method: "GET",
			credentials: "include",
		})
	);
	const navigate = useNavigate();

	return (
		<div className={cn("flex items-center gap-4", className)} {...props}>
			<div className="flex items-center gap-3">
				<Avatar>
					<AvatarFallback>
						{user?.name.charAt(0).toLocaleUpperCase()}
						{user?.lastName.charAt(0).toLocaleUpperCase()}
					</AvatarFallback>
				</Avatar>

				<div>
					<p className="max-w-[175px] truncate">
						{user?.name} {user?.lastName}
					</p>
					<p className="max-w-[175px] truncate text-sm text-muted-foreground">
						{user?.email}
					</p>
				</div>
			</div>

			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant={"ghost"}
						className="px-2 text-primary hover:text-primary"
						icon={<LogOut />}
						onClick={async () => {
							const res = await logOut.mutateAsync();
							if (res.ok) {
								return navigate("/signin");
							}
						}}
					/>
				</TooltipTrigger>
				<TooltipContent>Log out</TooltipContent>
			</Tooltip>
		</div>
	);
}
