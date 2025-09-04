import Sidebar from "@/components/sidebar";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
	component: () => (
		<>
			<div className="w-screen h-screen flex overflow-hidden">
				<Sidebar />
				<div className="h-screen max-h-screen grow w-[100px] bg-background p-[16px]">
					<Outlet />
				</div>
			</div>
			<TanStackRouterDevtools />
		</>
	),
});
