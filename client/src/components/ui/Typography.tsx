import { cn } from "@/lib/utils";

export function TypographyH2({ className, ...props }: React.ComponentPropsWithoutRef<"h1">) {
	return (
		<h1 className={cn("scroll-m-20 text-3xl font-bold tracking-tight", className)} {...props} />
	);
}

export function TypographyMuted({ className, ...props }: React.ComponentPropsWithoutRef<"p">) {
	return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export function TypographySmall({ className, ...props }: React.ComponentPropsWithoutRef<"small">) {
	return <small className={cn("text-sm font-medium leading-none", className)} {...props} />;
}
