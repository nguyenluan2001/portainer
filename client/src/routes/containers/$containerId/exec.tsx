import { createFileRoute, Link } from "@tanstack/react-router";
import { Terminal } from "@xterm/xterm";
import { Breadcrumb, Divider } from "antd";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/containers/$containerId/exec")({
	component: RouteComponent,
});

function RouteComponent() {
	const { containerId } = Route.useParams();

	const socketRef = useRef<WebSocket>(null);
	const terminalRef = useRef<Terminal>(null);

	useEffect(() => {
		onInitTerminal();
		onInitSocket();
	}, []);

	const createBreadcrumb = () => {
		return [
			{
				title: <Link to="/containers">Containers</Link>,
			},
			{
				title: <Link to={`/containers/${containerId}`}>{containerId}</Link>,
			},
		];
	};

	const onInitTerminal = () => {
		if (terminalRef.current) return;
		const terminalEl = document.getElementById("terminal");
		if (!terminalEl) return;
		var term = new Terminal({
			cursorBlink: true,
			cols: 150,
		});
		term.open(terminalEl);
		term.onData((data) => {
			// Send the data to the server via the WebSocket
			console.log("onData", data);
			// term.write(data)
			if (!socketRef.current) return;
			socketRef.current.send(data);
		});
		terminalRef.current = term;
	};

	const onInitSocket = async () => {
		if (socketRef.current) return;
		console.log(111111);
		const socket = new WebSocket(
			`${window.API_URL}/api/ws/exec?containerId=${containerId}`,
		);
		socketRef.current = socket;
		// // Connection opened
		socket.addEventListener("open", () => {
			socket.send("START_EXEC");
		});

		onListen();
	};

	const onListen = () => {
		if (!socketRef.current) return;
		socketRef.current.addEventListener("message", (event) => {
			if (!terminalRef.current) return;
			console.log("Message from server ", event.data);
			terminalRef.current.write(event.data);
		});
	};

	return (
		<div className="flex flex-col gap-2 h-full">
			<Breadcrumb items={createBreadcrumb()} />
			<Divider className="!my-2" />
			<div className="w-full grow h-[100px]" id="terminal"></div>
		</div>
	);
}
