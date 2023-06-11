import { Link } from "react-router-dom";
import { Home, Upload, User } from "lucide-react";
import { Button } from "./Button";
import Logo from "./Logo";
import SignOut from "./SignOut";
import { useQuery } from "@tanstack/react-query";
import type { Profile } from "@server/types";

export default function Nav() {
	const { data: currentUser } = useQuery<Profile>(
		["profile"],
		() => fetch("/api/user/profile").then((res) => res.json()),
		{ refetchOnWindowFocus: false }
	);

	return (
		<nav className="flex h-full flex-col items-center gap-2 border-r border-r-border px-12 pb-6 pt-10">
			<Logo className="text-4xl" />

			<ul className="w-full space-y-2">
				<NavItem href="/" label="Home" icon={<Home />} />
				<NavItem href="/upload" label="Upload" icon={<Upload />} />
				<NavItem
					href={`/profile/${currentUser?.username}`}
					label="Profile"
					icon={<User />}
				/>
			</ul>

			<SignOut className="mt-auto" />
		</nav>
	);
}

function NavItem({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
	return (
		<li>
			<Link to={href}>
				<Button
					className="-ml-5 h-12 w-full justify-start gap-3 text-lg text-foreground"
					variant={"ghost"}
					icon={icon}
				>
					{label}
				</Button>
			</Link>
		</li>
	);
}
