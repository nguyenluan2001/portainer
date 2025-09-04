import { ArrowLeftIcon } from "@phosphor-icons/react";
import { Button, Divider } from "antd";
import type { FC } from "react";
import Action from "./action";
import { Link } from "@tanstack/react-router";

interface Props {
	name: string;
	containerId: string;
}
const Toolbar: FC<Props> = ({ name, containerId }) => {
	return (
		<div className="w-full flex items-center justify-between px-3 pb-3 border-b border-border">
			<div className="flex items-center gap-4">
				<Link to="/containers">
					<Button icon={<ArrowLeftIcon />}>Back</Button>
				</Link>
				<Divider type="vertical" />
				<p className="text-lg font-bold text-foreground">{name}</p>
			</div>
			<Action containerId={containerId} />
		</div>
	);
};
export default Toolbar;
