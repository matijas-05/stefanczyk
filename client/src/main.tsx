import React from "react";
import ReactDOM from "react-dom/client";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SignIn from "@/routes/SignIn";
import SignUp from "./routes/SignUp";
import ConfirmAccount from "./routes/ConfirmAccount";
import AuthRoute from "./components/AuthRoute";
import RootLayout from "./layouts/RootLayout";
import "./styles.css";
import EditProfile from "./routes/EditProfile";
import { TooltipProvider } from "./components/ui/tooltip";

const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route
				path="/"
				element={
					<ProtectedRoute>
						<RootLayout />
					</ProtectedRoute>
				}
			>
				<Route index element={<h1>Home</h1>} />
				<Route path="/upload" element={<h1>Upload</h1>} />
				<Route path="/profile" element={<EditProfile />} />
			</Route>

			<Route
				path="/signin"
				element={
					<AuthRoute>
						<SignIn />
					</AuthRoute>
				}
			/>
			<Route
				path="/signup"
				element={
					<AuthRoute>
						<SignUp />
					</AuthRoute>
				}
			/>
			<Route
				path="/confirm"
				element={
					<AuthRoute>
						<ConfirmAccount />
					</AuthRoute>
				}
			/>
		</>
	)
);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<TooltipProvider delayDuration={400}>
				<RouterProvider router={router} />
			</TooltipProvider>
		</QueryClientProvider>
	</React.StrictMode>
);
