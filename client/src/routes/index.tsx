import { createFileRoute } from '@tanstack/react-router'
const DashboardPage = () => {
    return (
        <div>Dashboard page</div>
    )
}
export const Route = createFileRoute('/')({
    component: DashboardPage,
})