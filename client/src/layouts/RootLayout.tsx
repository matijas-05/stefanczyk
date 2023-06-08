import Nav from "@/components/ui/Nav";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
	return (
		<div className="grid h-screen grid-cols-[auto_1fr]">
			<Nav />
			<div className="overflow-auto p-6">
				<Outlet />
			</div>
		</div>
	);
}
