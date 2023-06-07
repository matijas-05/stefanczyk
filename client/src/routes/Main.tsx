import * as React from "react";
import { Button } from "@/components/ui/Button";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Profile from "@/components/ui/Profile";

export default function Main() {
	return (
		<div className="grid h-full w-full grid-flow-col place-items-center items-start">
			<div>zdjecia</div>
			<Profile />
		</div>
	);
}
