import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import SignIn from "@/routes/SignIn";
import SignUp from "./routes/SignUp";
import "./styles.css";

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<ProtectedRoute>
				<h1>Root</h1>
			</ProtectedRoute>
		),
	},
	{
		path: "/signin",
		element: <SignIn />,
	},
	{
		path: "/signup",
		element: <SignUp />,
	},
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
