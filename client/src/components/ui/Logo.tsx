import { cn } from "@/lib/utils";
import React from "react";

export default function Logo({ className, ...props }: React.ComponentPropsWithoutRef<"h1">) {
	return (
		<h1
			className={cn("mb-6 scroll-m-20 font-logo text-5xl tracking-tight", className)}
			{...props}
		>
			Instaapp
		</h1>
	);
}
