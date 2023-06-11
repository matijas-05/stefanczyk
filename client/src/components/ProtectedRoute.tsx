import * as React from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const navigate = useNavigate();
	const [authorized, setAuthorized] = React.useState(false);

	React.useEffect(() => {
		(async () => {
			const res = await fetch("/api/user/profile");
			if (!res.ok) {
				Cookies.remove("token", { sameSite: "strict" }); // options set to avoid warning in firefox
				return navigate("/signin");
			}
			setAuthorized(true);
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <>{authorized && children}</>;
}
