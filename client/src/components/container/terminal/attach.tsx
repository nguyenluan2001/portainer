import { useParams } from "@tanstack/react-router";
import { Terminal } from "@xterm/xterm";
import { useEffect, useId, useRef } from "react";

function AttachContainer() {
	const { containerId } = useParams({ strict: false });

	const socketRef = useRef<WebSocket>(null);
	const terminalRef = useRef<Terminal>(null);
	const terminalId = useId();

	const onInitTerminal = () => {
		if (terminalRef.current) return;
		const terminalEl = document.getElementById(terminalId);
		if (!terminalEl) return;
		const term = new Terminal({
			cursorBlink: true,
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
			`${window.API_URL}/api/ws/attach?containerId=${containerId}`,
		);
		socketRef.current = socket;
		// // Connection opened
		socket.addEventListener("open", () => {
			socket.send("START_ATTACH");
		});

		onListen();
	};

	const onListen = () => {
		if (!socketRef.current) return;
		socketRef.current.addEventListener("message", (event) => {
			if (!terminalRef.current) return;
			console.log("Message from server ", event.data);

			if (event.data === "CONNECTED") {
				console.log("Connected to the container terminal");
			} else {
				terminalRef.current.write(event.data);
			}
		});
	};

	const onDisconnect = () => {
		terminalRef?.current?.dispose();
		terminalRef.current = null;
		socketRef.current?.close();
		socketRef.current = null;
	};

	useEffect(() => {
		onInitTerminal();
		onInitSocket();
		return () => onDisconnect();
	}, []);

	return (
		<div className="w-full h-full">
			<div
				className="w-full max-h-[300px] bg-background text-foreground p-3 [&_.xterm-helpers]:size-0 overflow-y-auto"
				id={terminalId}
			/>
		</div>
	);
}
export default AttachContainer;
