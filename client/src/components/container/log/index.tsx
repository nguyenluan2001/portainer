import { FileIcon } from "@phosphor-icons/react";
import ContainerCard from "../card";
import { useEffect, useId, useRef, useState, type FC } from "react";
import { Terminal } from "@xterm/xterm";
import classNames from "classnames";
import { LazyLog } from "@melloware/react-logviewer";
import { decode, encode } from "html-entities";

interface Props {
	containerId: string;
}

const LogContainer: FC<Props> = ({ containerId }) => {
	const eventSourceRef = useRef<EventSource | null>(null);
	const logRef = useRef<LazyLog | null>(null);

	const onInitSSE = () => {
		console.log("onInitSSE");
		return;
		if (eventSourceRef.current) return;
		const path =
			window.API_URL?.replace(/\/+$/, "") + `/api/container/log/${containerId}`;
		console.log("path");
		eventSourceRef.current = new EventSource(path);
		eventSourceRef.current.onmessage = function (event) {
			console.log("New message", event.data);
			if (event?.data?.length === 0) return eventSourceRef.current?.close();
			console.log("New message", event.data);
			logRef.current?.appendLines([
				decode(event.data, {
					level: "html5",
				}),
			]);
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
		enableLinks: true,
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
		follow: true,
		text: "",
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
			<div className="max-h-[520px]">
				<LazyLog ref={logRef} {...args} />
			</div>
		</ContainerCard>
	);
};
export default LogContainer;
