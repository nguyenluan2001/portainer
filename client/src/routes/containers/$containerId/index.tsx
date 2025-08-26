import { createFileRoute, Link } from '@tanstack/react-router'
import { Breadcrumb } from 'antd'

export const Route = createFileRoute('/containers/$containerId/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { containerId } = Route.useParams()

  const createBreadcrumb = () => {
    return [
      {
        title: <Link to="/containers">Containers</Link>,
      },
      {
        title: containerId
      },
    ]
  }
  return <div>
    <Breadcrumb items={createBreadcrumb()} />
    <p className='text-foreground'>Container ID: {containerId}</p>
  </div>
}
