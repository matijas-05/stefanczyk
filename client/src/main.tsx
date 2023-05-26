import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignIn from "./routes/SignIn";
import ProtectedRoute from "./routes/ProtectedRoute";
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
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
