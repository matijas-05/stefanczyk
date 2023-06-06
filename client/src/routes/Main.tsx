import * as React from "react";
import { Button } from "@/components/ui/Button";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export default function Main() {
	const mutation = useMutation(() =>
		fetch("http://localhost:3001/api/user/logout", {
			method: "GET",
			credentials: "include",
		})
	);
	const navigate = useNavigate();

	return (
		<Button
			onClick={async () => {
				const res = await mutation.mutateAsync();
				if (res.ok) {
					return navigate("/signin");
				}
			}}
		>
			Log out
		</Button>
	);
}
