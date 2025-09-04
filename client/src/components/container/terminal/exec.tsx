import { useParams } from "@tanstack/react-router";
import { Terminal } from "@xterm/xterm";
import { Button, Form, Input, Select, Switch, type FormInstance } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useId, useRef, useState, type FC } from "react";
import classNames from "classnames";

interface IForm {
	command: string;
}

const ExecContainer = () => {
	const { containerId } = useParams({ strict: false });
	const socketRef = useRef<WebSocket>(null);
	const terminalRef = useRef<Terminal>(null);
	const terminalId = useId();
	const [form] = useForm<IForm>();
	const [isConnecting, setIsConnecting] = useState(false);
	const [isConnected, setIsConnected] = useState(false);

	const onInitTerminal = () => {
		if (terminalRef.current) return;
		const terminalEl = document.getElementById(terminalId);
		if (!terminalEl) return;
		const term = new Terminal({
			cursorBlink: true,
			cols: 150,
		});
		term.open(terminalEl);
		term.onData((data) => {
			// Send the data to the server via the WebSocket
			if (!socketRef.current) return;
			socketRef.current.send(data);
		});
		terminalRef.current = term;
	};

	const onListen = () => {
		if (!socketRef.current) return;
		socketRef.current.addEventListener("message", (event) => {
			if (!terminalRef.current) return;
			console.log("Message from server ", event.data);
			if (event.data === "CONNECTED" && !isConnecting) {
				setIsConnecting(false);
				setIsConnected(true);
			} else {
				terminalRef.current.write(event.data);
			}
		});
	};
	const onInitSocket = async (command: string) => {
		if (socketRef.current) return;
		console.log(111111);
		const socket = new WebSocket(
			`${window.API_URL}/api/ws/exec?containerId=${containerId}&cmd=${encodeURIComponent(command)}`,
		);
		socketRef.current = socket;
		// // Connection opened
		socket.addEventListener("open", () => {
			socket.send("START_EXEC");
		});
		socket.addEventListener("close", () => {
			console.log("The connection has been closed successfully.");
		});

		onListen();
	};

	const onDisconnect = () => {
		terminalRef?.current?.dispose();
		terminalRef.current = null;
		socketRef.current?.close();
		socketRef.current = null;
		setIsConnected(false);
	};

	const onConnect = async (v: IForm) => {
		if (terminalRef.current) {
			return onDisconnect();
		}
		setIsConnecting(true);
		await new Promise((resolve) => setTimeout(resolve, 500));
		onInitTerminal();
		onInitSocket(v.command);
	};
	useEffect(() => {
		return () => onDisconnect();
	}, []);

	return (
		<div className="w-full h-full flex flex-col gap-[16px]">
			<Form
				form={form}
				initialValues={{ command: "/bin/sh" }}
				className="p-3"
				onFinish={onConnect}
			>
				<ExecForm form={form} />
				<Button color="primary" onClick={form.submit} loading={isConnecting}>
					{isConnected ? "Disconnect" : "Connect"}
				</Button>
			</Form>
			<div
				className={classNames(
					"w-full max-h-[300px] bg-background text-foreground p-3 [&_.xterm-helpers]:size-0 overflow-y-auto",
					{
						"invisible h-0": !isConnected,
					},
				)}
				id={terminalId}
			/>
		</div>
	);
};

interface ExecFormProps {
	form: FormInstance;
}
const ExecForm: FC<ExecFormProps> = ({ form }) => {
	const COMMAND_OPTIONS = [
		{
			label: "/bin/sh",
			value: "/bin/sh",
		},
		{
			label: "/bin/bash",
			value: "/bin/bash",
		},
	];
	const [isCustomCmd, setIsCustomCmd] = useState(false);
	const onChangeCustomCmd = (checked: boolean) => {
		if (checked) {
			form.setFieldsValue({ command: "" });
			setIsCustomCmd(true);
			return;
		}
		form.setFieldsValue({ command: "/bin/sh" });
		setIsCustomCmd(false);
	};
	return (
		<div>
			<Form.Item label="Command" name="command">
				{isCustomCmd ? <Input /> : <Select options={COMMAND_OPTIONS} />}
			</Form.Item>
			<Form.Item label="Use custom command">
				<Switch onChange={onChangeCustomCmd} />
			</Form.Item>
		</div>
	);
};
export default ExecContainer;
