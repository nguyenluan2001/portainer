import type { FC } from "react";
import ContainerCard from "../card";
import {
	FileIcon,
	ShareNetworkIcon,
	SquaresFourIcon,
} from "@phosphor-icons/react";
import FileManager from "./file-manager";

interface Props {
	containerId: string;
}
const FileSharing: FC<Props> = ({ containerId }) => {
	return (
		<ContainerCard
			id="file-explorer"
			title={
				<div className="flex items-center gap-2">
					<SquaresFourIcon className="size-[24px]" />
					<p className="text-foreground">File explorer</p>
				</div>
			}
		>
			<FileManager containerId={containerId} />
		</ContainerCard>
	);
};
export default FileSharing;
