import {
	killContainerProxy,
	removeContainerProxy,
	restartContainerProxy,
} from "@/services/proxy/container";
import {
	ArrowsClockwiseIcon,
	PauseIcon,
	PlayIcon,
	ProhibitIcon,
	StopIcon,
	TrashIcon,
} from "@phosphor-icons/react";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Space } from "antd";
import type { FC } from "react";
import { toast } from "react-toastify";

interface Props {
	containerId: string;
}
const Action: FC<Props> = ({ containerId }) => {
	const queryClient = useQueryClient();
	const onKill = async () => {
		killContainerProxy(containerId)
			.then(() => {
				toast.success("Kill container successfully");
				queryClient.invalidateQueries({ queryKey: ["container", containerId] });
			})
			.catch(() => {
				toast.error("Failed to kill container");
			});
	};
	const onRestart = async () => {
		await restartContainerProxy(containerId)
			.then(() => {
				toast.success("Restart container successfully");
				queryClient.invalidateQueries({ queryKey: ["container", containerId] });
			})
			.catch(() => {
				toast.error("Failed to restart container");
			});
	};
	const onRemove = async () => {
		await removeContainerProxy(containerId)
			.then(() => {
				toast.success("Remove container successfully");
				queryClient.invalidateQueries({ queryKey: ["container", containerId] });
			})
			.catch(() => {
				toast.error("Failed to remove container");
			});
	};
	return (
		<Space.Compact>
			<Button onClick={onKill} icon={<ProhibitIcon />}>
				Kill
			</Button>
			<Button onClick={onRestart} icon={<ArrowsClockwiseIcon />}>
				Restart
			</Button>
			<Button onClick={onRemove} icon={<TrashIcon />}>
				Remove
			</Button>
		</Space.Compact>
	);
};
export default Action;
