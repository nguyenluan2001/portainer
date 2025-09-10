import {
	DatabaseIcon,
	FileIcon,
	GlobeIcon,
	ShareNetworkIcon,
	SquaresFourIcon,
	TerminalIcon,
} from "@phosphor-icons/react";
import { Anchor } from "antd";
import { useEffect, useState } from "react";

const Sidebar = () => {
	const [defaultAnchor, setDefaultAnchor] = useState("");

	useEffect(() => {
		const anchor = window.location.hash;
		if (!anchor) return;
		setDefaultAnchor(anchor);
	}, []);
	return (
		<div className="h-full w-48 border-r border-border p-3">
			<Anchor
				affix={false}
				// onClick={handleClick}
				getCurrentAnchor={(activeLink) => {
					if (defaultAnchor) {
						const clonedAnchor = defaultAnchor;
						setDefaultAnchor("");
						return clonedAnchor;
					}
					return activeLink;
				}}
				items={[
					{
						key: "1",
						href: "#overview",
						title: (
							<div className="flex items-center gap-2">
								<GlobeIcon />
								<p className="text-foreground">Overview</p>
							</div>
						),
					},
					{
						key: "2",
						href: "#terminal",
						title: (
							<div className="flex items-center gap-2">
								<TerminalIcon />
								<p className="text-foreground">Terminal</p>
							</div>
						),
					},
					{
						key: "3",
						href: "#log",
						title: (
							<div className="flex items-center gap-2">
								<FileIcon />
								<p className="text-foreground">Log</p>
							</div>
						),
					},
					{
						key: "4",
						href: "#file-explorer",
						title: (
							<div className="flex items-center gap-2">
								<SquaresFourIcon />
								<p className="text-foreground">File explorer</p>
							</div>
						),
					},
					{
						key: "5",
						href: "#volume",
						title: (
							<div className="flex items-center gap-2">
								<DatabaseIcon />
								<p className="text-foreground">Volume</p>
							</div>
						),
					},
					{
						key: "6",
						href: "#networking",
						title: (
							<div className="flex items-center gap-2">
								<ShareNetworkIcon />
								<p className="text-foreground">Networking</p>
							</div>
						),
					},
				]}
			/>
		</div>
	);
};

export default Sidebar;
