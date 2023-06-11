import { Link } from "react-router-dom";
import { Home, Upload } from "lucide-react";
import { Button } from "./Button";
import Logo from "./Logo";
import SignOut from "./SignOut";
import { useQuery } from "@tanstack/react-query";
import type { Profile } from "@server/types";
import { ProfilePicture } from "./Avatar";

export default function Nav() {
	const { data: currentUser } = useQuery<Profile>(
		["profile"],
		() => fetch("/api/user/profile").then((res) => res.json()),
		{ refetchOnWindowFocus: false }
	);

	return (
		<nav className="flex h-full flex-col items-center gap-2 border-r border-r-border px-12 pb-6 pt-10">
			<Logo className="text-4xl" />

			<ul className="ml-10 flex w-full flex-col gap-2">
				<NavItem href="/" label="Home" icon={<Home className="h-6 w-6" />} />
				<NavItem href="/upload" label="Upload" icon={<Upload className="h-6 w-6" />} />
				<NavItem
					className="-ml-1"
					href={`/profile/${currentUser?.username}`}
					label="Profile"
					icon={<ProfilePicture user={currentUser} className="h-8 w-8" />}
				/>
			</ul>

			<SignOut className="mt-auto" />
		</nav>
	);
}

function NavItem({
	href,
	label,
	icon,
	className,
	...props
}: { href: string; label: string; icon: React.ReactNode } & React.ComponentProps<"li">) {
	return (
		<li className={className} {...props}>
			<Link to={href}>
				<Button
					className="-ml-5 h-12 w-full justify-start gap-3 text-lg text-foreground"
					variant={"link"}
					icon={icon}
				>
					{label}
				</Button>
			</Link>
		</li>
	);
}
