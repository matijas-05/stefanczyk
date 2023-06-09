"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";
import type { Profile } from "@server/types";

const Avatar = React.forwardRef<
	React.ElementRef<typeof AvatarPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
	<AvatarPrimitive.Root
		ref={ref}
		className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
		{...props}
	/>
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
	React.ElementRef<typeof AvatarPrimitive.Image>,
	React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
	<AvatarPrimitive.Image
		ref={ref}
		className={cn("aspect-square h-full w-full", className)}
		{...props}
	/>
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
	React.ElementRef<typeof AvatarPrimitive.Fallback>,
	React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
	<AvatarPrimitive.Fallback
		ref={ref}
		className={cn(
			"flex h-full w-full items-center justify-center rounded-full bg-muted",
			className
		)}
		{...props}
	/>
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

const ProfilePicture = ({ user }: { user: Profile | undefined }) => (
	<Avatar>
		{user?.profilePicture && (
			<AvatarImage src={"http://localhost:3001/api/" + user.profilePicture} />
		)}
		<AvatarFallback>
			{user?.name.charAt(0).toLocaleUpperCase()}
			{user?.lastName.charAt(0).toLocaleUpperCase()}
		</AvatarFallback>
	</Avatar>
);

export { Avatar, AvatarImage, AvatarFallback, ProfilePicture };
