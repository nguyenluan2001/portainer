import { Card } from "antd";
import type { FC, ReactNode } from "react";

interface Props {
	id: string;
	title: ReactNode;
	extra?: ReactNode;
	children?: ReactNode;
}
const ContainerCard: FC<Props> = ({ id, title, extra, children }) => {
	return (
		<Card id={id} className="h-fit" title={title} extra={extra || <></>}>
			{children}
		</Card>
	);
};
export default ContainerCard;
