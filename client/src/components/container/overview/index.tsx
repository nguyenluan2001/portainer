import type { IContainerDetail } from "@/type/container_detail";
import { useMemo, type FC } from "react";
import ContainerCard from "../card";
import type { ColumnsType } from "antd/es/table";
import Table from "antd/es/table";
import { GlobeIcon } from "@phosphor-icons/react";

interface Props {
	containerDetail: IContainerDetail;
}
const Overview: FC<Props> = ({ containerDetail }) => {
	const generateDataSource = () => {
		const dataSource = [
			{ field: "ID", value: containerDetail?.Id },
			{ field: "Image", value: containerDetail?.Image },
			{ field: "Name", value: containerDetail?.Name.replace("/", "") },
			{ field: "Status", value: containerDetail?.State.Status },
			{
				field: "Created",
				value: new Date(containerDetail?.Created).toLocaleString(),
			},
		];
		return dataSource;
	};
	const columns: ColumnsType<any> = [
		{ title: "", dataIndex: "field" },
		{
			title: "",
			dataIndex: "value",
		},
	];
	const dataSource = useMemo(() => generateDataSource(), [containerDetail]);
	return (
		<ContainerCard
			id="overview"
			title={
				<div className="flex items-center gap-2">
					<GlobeIcon className="size-[24px]" />
					<p className="text-foreground">Overview</p>
				</div>
			}
		>
			<Table
				dataSource={dataSource}
				columns={columns}
				pagination={false}
				showHeader={false}
			/>
		</ContainerCard>
	);
};
export default Overview;
