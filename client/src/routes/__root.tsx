import Sidebar from '@/components/sidebar'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
    component: () => (
        <>
            <div className='w-screen h-screen flex'>
                <Sidebar />
                <div className='h-full grow w-[100px] bg-background p-[16px] overflow-auto'>
                    <Outlet />
                </div>
            </div>
            <TanStackRouterDevtools />
        </>
    ),
})