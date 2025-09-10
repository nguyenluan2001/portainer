import { DatabaseIcon } from "@phosphor-icons/react";
import ContainerCard from "../card";
import type { ColumnsType } from "antd/es/table";
import type { Mounts } from "@/type/container_detail";
import type { FC } from "react";
import Table from "antd/es/table";

interface Props {
	mounts?: Mounts[];
}
const Volume: FC<Props> = ({ mounts }) => {
	const columns: ColumnsType<Mounts> = [
		{
			title: "Host/volume",
			dataIndex: "Source",
		},
		{
			title: "Container",
			dataIndex: "Destination",
		},
	];
	return (
		<ContainerCard
			id="volume"
			title={
				<div className="flex items-center gap-2">
					<DatabaseIcon className="size-[24px]" />
					<p className="text-foreground">Volume</p>
				</div>
			}
			className="!h-[500px]"
		>
			<Table
				columns={columns}
				dataSource={mounts || []}
				bordered
				pagination={false}
			/>
		</ContainerCard>
	);
};
export default Volume;
