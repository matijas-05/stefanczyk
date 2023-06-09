import { Suspense } from "react";
import { Link } from "react-router-dom";
import { Button } from "./Button";
import Logo from "./Logo";
import { Home, Upload, User } from "lucide-react";
import Profile from "./Profile";
import { Skeleton } from "./Skeleton";

export default function Nav() {
	return (
		<nav className="flex h-full flex-col items-center gap-2 border-r border-r-border p-8">
			<Logo className="text-4xl" />

			<ul className="space-y-1 w-full">
				<NavItem href="/" label="Home" icon={<Home />} />
				<NavItem href="/upload" label="Upload" icon={<Upload />} />
				<NavItem href="/profile" label="Profile" icon={<User />} />
			</ul>

			<Suspense fallback={<Skeleton className="mt-auto h-10 w-60" />}>
				<Profile className="mt-auto" />
			</Suspense>
		</nav>
	);
}

function NavItem({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
	return (
		<li>
			<Link to={href}>
				<Button
					className="flex h-12 w-full justify-start text-base text-foreground"
					variant={"ghost"}
					icon={icon}
				>
					{label}
				</Button>
			</Link>
		</li>
	);
}
