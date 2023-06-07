import Nav from "@/components/ui/Nav";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
	return (
		<div className="flex h-full w-full items-start">
			<Nav />
			<div className="mx-auto">
				<Outlet />
			</div>
		</div>
	);
}
