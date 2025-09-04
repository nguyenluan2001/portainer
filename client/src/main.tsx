import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import type { Terminal } from "@xterm/xterm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { ConfigProvider } from "antd";
import { ToastContainer } from "react-toastify";

declare global {
	interface Window {
		API_URL: string;
		SOCKET: WebSocket;
		TERMINAL: Terminal;
	}
}

const queryClient = new QueryClient();
const router = createRouter({
	routeTree,
});

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<ConfigProvider
				theme={{
					components: {
						Menu: {
							colorBgBase: "var(--sidebar)",
							colorBgContainer: "var(--sidebar)",
							itemColor: "var(--sidebar-foreground)",

							itemSelectedBg: "var(--sidebar-accent)",
							itemSelectedColor: "var(--sidebar-foreground)",

							itemHoverBg: "var(--sidebar-accent)",
							itemHoverColor: "var(--sidebar-foreground)",

							itemHeight: 32,
						},
						// Button: {
						// 	// colorBgContainer: "var(--ring)",
						// 	// colorBgBase: "var(--ring)",
						// 	// colorBorder: "var(--ring)",
						// 	// colorPrimaryBg: "var(--ring)",
						// 	// textTextColor: "var(--text-primary)",
						// 	// colorText: "var(--text-primary)",
						// 	// colorTextDisabled: "var(--text-primary)",
						// 	// solidTextColor: "var(--text-primary)",
						// 	// defaultHoverColor: "var(--text-primary)",
						// },
						Popover: {
							colorBgContainer: "var(--bg-primary)",
							colorBgElevated: "var(--bg-primary)",
							colorBorder: "var(--bg-secondary)",
						},
						Segmented: {
							trackBg: "var(--bg-secondary)",
							itemActiveBg: "var(--bg-primary)",
							itemSelectedBg: "var(--bg-primary)",
							itemColor: "var(--text-primary)",
							itemSelectedColor: "var(--text-primary)",
						},
						Tag: {
							defaultBg: "var(--bg-secondary)",
							colorText: "var(--text-primary)",
							colorBorder: "var(--text-primary)",
						},
						Table: {
							colorBgContainer: "var(--card)",
							colorText: "var(--card-foreground)",
							borderColor: "var(--border)",
							rowHoverBg: "var(--muted)",
							headerBg: "var(--card)",
							headerColor: "var(--card-foreground)",
						},
						Breadcrumb: {
							itemColor: "var(--foreground)",
							linkColor: "var(--foreground)",
							linkHoverColor: "var(--muted-foreground)",
							separatorColor: "var(--foreground)",
							lastItemColor: "var(--muted-foreground)",
						},
						Divider: {
							colorSplit: "var(--border)",
						},
						Card: {
							colorBgContainer: "var(--card)",
							colorText: "var(--card-foreground)",
							colorBorder: "var(--border-color)",
							colorBorderSecondary: "var(--border)",
							colorTextHeading: "var(--card-foreground)",
						},
						Select: {
							colorBgContainer: "var(--bg-primary)",
							colorBgMask: "var(--card)",
							colorBorder: "var(--border)",
							colorText: "var(--text-primary)",
							colorTextPlaceholder: "var(--text-secondary)",
							colorPrimary: "var(--accent)",
							colorPrimaryHover: "var(--accent-hover)",
						},
						Form: {
							colorText: "var(--text-primary)",
							labelColor: "var(--text-primary)",
						},
						Input: {
							colorBgContainer: "var(--bg-primary)",
							colorText: "var(--text-primary)",
						},
						Anchor: {
							colorText: "var(--foreground)",
						},
					},
				}}
			>
				<RouterProvider router={router} />
				<ToastContainer />
			</ConfigProvider>
		</QueryClientProvider>
	</StrictMode>,
);
