import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import type { Terminal } from '@xterm/xterm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen'
import { ConfigProvider } from 'antd';

declare global {
  interface Window {
    API_URL: string;
    SOCKET: WebSocket
    TERMINAL: Terminal
  }
}

const queryClient = new QueryClient()
const router = createRouter({
  routeTree
})


createRoot(document.getElementById('root')!).render(
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
            Button: {
              colorBgContainer: "var(--bg-secondary)",
              colorBgBase: "var(--bg-secondary)",
              textTextColor: "var(--text-primary)",
              colorText: "var(--text-primary)",
              colorTextDisabled: "var(--text-primary)",
              solidTextColor: "var(--text-primary)",
              colorBorder: "var(--border-color)",
            },
            Popover: {
              colorBgContainer: "var(--bg-primary)",
              colorBgElevated: 'var(--bg-primary)',
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
              colorBorder: "var(--text-primary)"
            },
            Table: {
              colorBgContainer: "var(--card)",
              colorText: "var(--card-foreground)",
              borderColor: "var(--border)",
              rowHoverBg: "var(--muted)",
              headerBg: "var(--card)",
              headerColor: "var(--card-foreground)",
            }
          },
        }}
      >
        <RouterProvider router={router} />
      </ConfigProvider>
    </QueryClientProvider>
  </StrictMode>,
)
