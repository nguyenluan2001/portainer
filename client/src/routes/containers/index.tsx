import { createFileRoute, Link } from "@tanstack/react-router"
import { getListContainerProxy } from '@/services/proxy/container'
import type { IContainerItem } from '@/type/container'
import { useQuery } from '@tanstack/react-query'
import { Button, Table, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import React from 'react'
import { CodeIcon, Paperclip } from "@phosphor-icons/react"
import Layout from "@/components/main/layout"
const ContainerPage = () => {
    const { data } = useQuery({
        queryKey: ['get-list-containers'],
        queryFn: getListContainerProxy
    })
    const columns: ColumnsType<IContainerItem> = [
        {
            title: "Name",
            dataIndex: "Names",
            render(value, record, index) {
                return value[0].replaceAll("/", "")
            },
        }, {
            title: "State",
            dataIndex: "State"
        },

        {
            title: "Quick action",
            dataIndex: "Id",
            render(value, record, index) {
                return (
                    <div className='flex items-center gap-2'>
                        <Tooltip title="Exec">
                            <div>
                                <Link to={`${value}/exec`}>
                                    <Button size="small" icon={<CodeIcon />} />
                                </Link>
                            </div>
                        </Tooltip>
                        <Tooltip title="Attach">
                            <div>

                                <Link to={`${value}/attach`}>
                                    <Button size="small" icon={<Paperclip />} />
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
            render(value, record, index) {
                return dayjs(value * 1000).format("YYYY-MM-DD HH:mm:ss")
            },
        }
    ]
    console.log("data", data)
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