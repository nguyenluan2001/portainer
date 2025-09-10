import { DatabaseIcon, ShareNetworkIcon } from "@phosphor-icons/react";
import ContainerCard from "../card";
import type { ColumnsType } from "antd/es/table";
import type { Mounts, Networks } from "@/type/container_detail";
import { useMemo, type FC } from "react";
import Table from "antd/es/table";

interface Props {
	networks?: Networks;
}
interface INetworkItem extends Networks {
	Network: string;
}
const Networking: FC<Props> = ({ networks }) => {
	const columns: ColumnsType<INetworkItem> = [
		{
			title: "Network",
			dataIndex: "Network",
		},
		{
			title: "IP address",
			dataIndex: "IPAddress",
		},
		{
			title: "Gateway",
			dataIndex: "Gateway",
		},
		{
			title: "Mac address",
			dataIndex: "MacAddress",
		},
	];

	const dataSource = useMemo(() => {
		return Object.entries(networks || {})?.reduce<INetworkItem[]>(
			(pre, [Network, data]) => {
				return [
					...pre,
					{
						Network,
						...data,
					},
				];
			},
			[],
		);
	}, [networks]);
	return (
		<ContainerCard
			id="networking"
			title={
				<div className="flex items-center gap-2">
					<ShareNetworkIcon className="size-[24px]" />
					<p className="text-foreground">Networking</p>
				</div>
			}
			className="!h-[500px]"
		>
			<Table
				columns={columns}
				dataSource={dataSource}
				bordered
				pagination={false}
			/>
		</ContainerCard>
	);
};
export default Networking;
