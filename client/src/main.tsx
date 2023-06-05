import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import SignIn from "@/routes/SignIn";
import SignUp from "./routes/SignUp";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	</React.StrictMode>
);
