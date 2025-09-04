import { GlobeIcon, TerminalIcon } from "@phosphor-icons/react";
import { Anchor } from "antd";

const Sidebar = () => {
	return (
		<div className="h-full w-48 border-r border-border p-3">
			<Anchor
				affix={false}
				// onClick={handleClick}
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
				]}
			/>
		</div>
	);
};

export default Sidebar;
