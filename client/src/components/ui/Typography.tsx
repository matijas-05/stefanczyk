import { cn } from "@/lib/utils";

export function TypographyH2({ className, ...props }: React.ComponentPropsWithoutRef<"h1">) {
	return (
		<h1
			className={cn("scroll-m-20 text-3xl font-extrabold tracking-tight", className)}
			{...props}
		/>
	);
}
