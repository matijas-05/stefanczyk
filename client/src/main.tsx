import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import SignIn from "@/routes/SignIn";
import SignUp from "./routes/SignUp";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./styles.css";
import ConfirmAccount from "./routes/ConfirmAccount";
import AuthRoute from "./components/AuthRoute";
import Main from "./routes/Main";

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<ProtectedRoute>
				<Main />
			</ProtectedRoute>
		),
	},
	{
		path: "/signin",
		element: (
			<AuthRoute>
				<SignIn />
			</AuthRoute>
		),
	},
	{
		path: "/signup",
		element: (
			<AuthRoute>
				<SignUp />
			</AuthRoute>
		),
	},
	{
		path: "/confirm",
		element: (
			<AuthRoute>
				<ConfirmAccount />
			</AuthRoute>
		),
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
