import { Select } from "antd";
import ContainerCard from "../card";
import { useState } from "react";
import ExecContainer from "./exec";
import AttachContainer from "./attach";
import { TerminalIcon } from "@phosphor-icons/react";

const TERMINAL_OPTIONS = [
	{
		label: "Execute",
		value: "exec",
	},
	{
		label: "Attach",
		value: "attach",
	},
];
const Terminal = () => {
	const [action, setAction] = useState("exec");
	return (
		<ContainerCard
			id="terminal"
			title={
				<div className="flex items-center gap-2">
					<TerminalIcon className="size-[24px]" />
					<p className="text-foreground">Terminal</p>
				</div>
			}
			extra={
				<Select
					className="w-[100px]"
					options={TERMINAL_OPTIONS}
					onSelect={(v) => setAction(v)}
					value={action}
				/>
			}
		>
			{action === "exec" && <ExecContainer />}
			{action === "attach" && <AttachContainer />}
		</ContainerCard>
	);
};
export default Terminal;
