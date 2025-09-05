import { Card } from "antd";
import classNames from "classnames";
import type { FC, ReactNode } from "react";

interface Props {
	id: string;
	title: ReactNode;
	extra?: ReactNode;
	children?: ReactNode;
	className?: string;
}
const ContainerCard: FC<Props> = ({
	id,
	title,
	extra,
	children,
	className,
}) => {
	return (
		<Card
			id={id}
			className={classNames("h-fit", className)}
			title={title}
			extra={extra || <></>}
		>
			{children}
		</Card>
	);
};
export default ContainerCard;
