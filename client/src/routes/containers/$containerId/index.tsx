import FileSharing from "@/components/container/file-sharing";
import LogContainer from "@/components/container/log";
import Overview from "@/components/container/overview";
import Sidebar from "@/components/container/sidebar";
import Terminal from "@/components/container/terminal";
import Toolbar from "@/components/container/toolbar/toolbar";
import { getContainerDetailProxy } from "@/services/proxy/container";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Spin } from "antd";

export const Route = createFileRoute("/containers/$containerId/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { containerId } = Route.useParams();
	const { data: containerDetail } = useQuery({
		queryKey: ["container", containerId],
		queryFn: async () => getContainerDetailProxy(containerId),
		enabled: !!containerId,
	});
	console.log(containerDetail);

	return (
		<div className="w-full h-full max-h-full overflow-hidden flex flex-col">
			<Toolbar name={"Container name"} containerId={containerId} />
			<div className="w-full flex grow max-h-full overflow-hidden">
				<Sidebar />
				<div className="grow w-[100px] p-3 flex flex-col gap-3 max-h-full h-full overflow-y-auto">
					<Overview containerDetail={containerDetail!} />
					<Terminal />
					<LogContainer containerId={containerId} />
					<FileSharing containerId={containerId} />
				</div>
			</div>
		</div>
	);
}
