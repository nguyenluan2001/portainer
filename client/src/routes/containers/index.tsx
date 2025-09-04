import Layout from "@/components/main/layout"
import { getListContainerProxy } from '@/services/proxy/container'
import type { IContainerItem } from '@/type/container'
import { CodeIcon, Paperclip } from "@phosphor-icons/react"
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from "@tanstack/react-router"
import { Button, Table, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
const ContainerPage = () => {
    const { data } = useQuery({
        queryKey: ['get-list-containers'],
        queryFn: getListContainerProxy
    })
    const columns: ColumnsType<IContainerItem> = [
        {
            title: "Name",
            dataIndex: "Names",
            render(value, record) {
                const name = value[0].replaceAll("/", "")
                const id = record.Id
                return <Link to={`${id}`}>{name}</Link>
            },
        }, {
            title: "State",
            dataIndex: "State"
        },

        {
            title: "Quick action",
            dataIndex: "Id",
            render(value, record) {
                const isRunning = record.State === "running"
                return (
                    <div className='flex items-center gap-2'>
                        <Tooltip title="Exec">
                            <div>
                                <Link to={`${value}/exec`}>
                                    <Button disabled={!isRunning} size="small" icon={<CodeIcon />} />
                                </Link>
                            </div>
                        </Tooltip>
                        <Tooltip title="Attach">
                            <div>

                                <Link to={`${value}/attach`}>
                                    <Button disabled={!isRunning} size="small" icon={<Paperclip />} />
                                </Link>
                            </div>
                        </Tooltip>
                    </div>
                )
            },
        },
        {
            title: "Image",
            dataIndex: "Image"
        }, {
            title: "Created at",
            dataIndex: "Created",
            render(value) {
                return dayjs(value * 1000).format("YYYY-MM-DD HH:mm:ss")
            },
        }
    ]
    return (
        <Layout title="Containers" description="View and Manage your Containers">
            <div className="w-full h-full">
                <Table
                    columns={columns}
                    dataSource={data?.containers || []}
                />
            </div>
        </Layout>
    )
}

export const Route = createFileRoute('/containers/')({
    component: ContainerPage,
})