import * as React from "react";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
	if (!Cookies.get("token")) {
		return <Navigate to="/signin" />;
	}

	return <>{children}</>;
}
