import { Link } from "react-router-dom";
import { Button } from "./Button";
import Logo from "./Logo";
import { Home, Upload, User } from "lucide-react";
import Profile from "./Profile";

export default function Nav() {
	return (
		<nav className="flex h-full flex-col items-center gap-2 border-r border-r-border py-8 pl-4 pr-4">
			<Logo />

			<ul className="w-full space-y-1">
				<NavItem href="/" label="Home" icon={<Home />} />
				<NavItem href="/upload" label="Upload" icon={<Upload />} />
				<NavItem href="/profile" label="Profile" icon={<User />} />
			</ul>

			<Profile className="mt-auto" />
		</nav>
	);
}

function NavItem({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
	return (
		<li className="w-full">
			<Link className="w-full" to={href}>
				<Button
					className="flex h-12 w-full justify-start text-base"
					variant={"ghost"}
					icon={icon}
				>
					{label}
				</Button>
			</Link>
		</li>
	);
}
