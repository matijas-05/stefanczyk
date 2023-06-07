import * as React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "./Avatar";
import type { Profile } from "@server/types";
import { Button } from "./Button";
import { useNavigate } from "react-router-dom";

export default function Profile() {
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
		<div className="flex items-center gap-8">
			<div className="flex items-center gap-3">
				<Avatar>
					<AvatarFallback>
						{user?.name.charAt(0).toLocaleUpperCase()}
						{user?.lastName.charAt(0).toLocaleUpperCase()}
					</AvatarFallback>
				</Avatar>

				<div>
					<p>
						{user?.name} {user?.lastName}
					</p>
					<p className="text-sm text-muted-foreground">{user?.email}</p>
				</div>
			</div>
			<Button
				variant={"link"}
				onClick={async () => {
					const res = await logOut.mutateAsync();
					if (res.ok) {
						return navigate("/signin");
					}
				}}
			>
				Log out
			</Button>
		</div>
	);
}
