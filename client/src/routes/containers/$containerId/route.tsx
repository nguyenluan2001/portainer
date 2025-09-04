import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/containers/$containerId")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		// <Layout title="Containers" description="View and Manage your Containers">
		//   <div className="w-full h-full">
		//     <Outlet />
		//   </div>
		// </Layout>
		<div className="w-full h-full">
			<Outlet />
		</div>
	);
}
