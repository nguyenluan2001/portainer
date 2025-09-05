import { FileIcon } from "@phosphor-icons/react";
import ContainerCard from "../card";
import { useEffect, useId, useRef, useState, type FC } from "react";
import { Terminal } from "@xterm/xterm";
import classNames from "classnames";
import { LazyLog } from "@melloware/react-logviewer";

interface Props {
	containerId: string;
}
const LogContainer: FC<Props> = ({ containerId }) => {
	const [isConnected, setIsConnected] = useState(false);
	const terminalRef = useRef<Terminal>(null);
	const eventSourceRef = useRef<EventSource | null>(null);
	const logRef = useRef<LazyLog | null>(null);
	const terminalId = useId();

	const onInitSSE = () => {
		if (eventSourceRef.current) return;
		const path =
			window.API_URL?.replace(/\/+$/, "") + `/api/container/log/${containerId}`;
		eventSourceRef.current = new EventSource(path);
		eventSourceRef.current.onmessage = function (event) {
			setIsConnected(true);
			if (event?.data?.length === 0) return;
			console.log("New message", event.data);
			logRef.current?.appendLines([event.data]);
		};
	};

	useEffect(() => {
		onInitSSE();
	}, []);
	const args = {
		caseInsensitive: true,
		enableGutters: false,
		enableHotKeys: true,
		enableLineNumbers: true,
		enableLinks: false,
		wrapLines: false,
		enableMultilineHighlight: true,
		enableSearch: true,
		enableSearchNavigation: true,
		extraLines: 1,
		height: "400",
		loadingComponent: undefined,
		onError: undefined,
		onHighlight: undefined,
		onLineNumberClick: undefined,
		onLoad: undefined,
		selectableLines: true,
		width: "auto",
		external: true,
	};
	return (
		<ContainerCard
			id="log"
			title={
				<div className="flex items-center gap-2">
					<FileIcon className="size-[24px]" />
					<p className="text-foreground">Log</p>
				</div>
			}
			className="!h-[500px]"
		>
			{/* <div
				className={classNames(
					"w-full max-h-[300px] bg-background text-foreground p-3 [&_.xterm-helpers]:size-0 overflow-y-auto",
					{
						"invisible h-0": !isConnected,
					},
				)}
				id={terminalId}
			/> */}
			<div className="max-h-[520px]">
				<LazyLog ref={logRef} {...args} />
			</div>
		</ContainerCard>
	);
};
export default LogContainer;
