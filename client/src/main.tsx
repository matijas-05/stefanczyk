import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "./routes/Home";
import Upload from "./routes/Upload";
import EditProfile from "./routes/EditProfile";
import SignIn from "./routes/SignIn";
import SignUp from "./routes/SignUp";
import ConfirmAccount from "./routes/ConfirmAccount";
import AuthRoute from "./components/AuthRoute";
import RootLayout from "./layouts/RootLayout";
import { TooltipProvider } from "./components/ui/Tooltip";
import "./styles.css";
import Post from "./routes/Post";

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
				<Route
					index
					element={
						<Suspense>
							<Home />
						</Suspense>
					}
				/>
				<Route path="/upload" element={<Upload />} />
				<Route path="/profile" element={<EditProfile />} />

				<Route
					path="/post/:post"
					element={
						<Suspense>
							<Post />
						</Suspense>
					}
				/>
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
