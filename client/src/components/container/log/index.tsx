import { FileIcon } from "@phosphor-icons/react";
import ContainerCard from "../card";
import { useEffect, type FC } from "react";

interface Props {
	containerId: string;
}
const LogContainer: FC<Props> = ({ containerId }) => {
	const onInitSSE = () => {
		const path =
			window.API_URL?.replace(/\/+$/, "") + `/api/container/log/${containerId}`;
		const evtSource = new EventSource(path);
		evtSource.onmessage = function (event) {
			console.log("New message", event.data);
		};
	};

	useEffect(() => {
		onInitSSE();
	}, []);
	return (
		<ContainerCard
			id="log"
			title={
				<div className="flex items-center gap-2">
					<FileIcon className="size-[24px]" />
					<p className="text-foreground">Log</p>
				</div>
			}
		>
			LOGS
		</ContainerCard>
	);
};
export default LogContainer;
