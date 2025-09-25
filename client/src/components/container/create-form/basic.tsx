import { useQueryKeysFactory } from "@/hooks/react-query/useQueryKeysFactory"
import { getImageListProxy } from "@/services/proxy/image"
import type { IImageItem } from "@/type/image"
import { useQuery } from "@tanstack/react-query"
import { Form, Input, Segmented, Select, type FormInstance } from "antd"
import type { DefaultOptionType } from "antd/es/select"
import { useEffect, useMemo, useState, type FC } from "react"

interface Props {
    form: FormInstance<any>
}
const IMAGE_LOCATION = {
    Local: 'Local',
    Remote: 'Remote',
}
const RESTART_POLICY = [
    {
        label: 'No',
        value: 'No'
    },
    {
        label: 'Always',
        value: 'Always'
    },
    {
        label: 'On Failure',
        value: 'On Failure'
    },
    {
        label: 'Unlesss Stopped',
        value: 'Unlesss Stopped'
    },

]
const BasicForm: FC<Props> = ({ form }) => {
    const [imageLocation, setImageLocation] = useState(IMAGE_LOCATION.Local)
    const { imageKeys: { getImageList } } = useQueryKeysFactory()
    const { data: { images }, isLoading, isFetching } = useQuery({
        queryKey: getImageList(),
        queryFn: getImageListProxy,
        initialData: {
            images: [] as IImageItem[]
        }
    })

    console.log('images', images)
    const imageOptions: DefaultOptionType[] = useMemo(() => {
        if (isLoading || isFetching) return [] as DefaultOptionType[]
        return images?.map((item: IImageItem) => {
            if (item.RepoTags?.length === 0) return {
                label: '<none>:<none>',
                value: item.Id
            }
            return {
                label: item.RepoTags?.[0],
                value: item.Id
            }
        }) as DefaultOptionType[]
    }, [images, isLoading, isFetching])
    return (
        <>
            <Form.Item name="name" label="Name">
                <Input placeholder="e.g., my-container" />
            </Form.Item>
            <Form.Item name="image" className="[&_label]:w-full" label={
                <div className="w-full flex items-center justify-between">
                    <p>Image</p>
                    <Segmented
                        value={imageLocation}
                        options={Object.keys(IMAGE_LOCATION)}
                        onChange={(value) => {
                            setImageLocation(value)
                            form.resetFields(['image'])
                        }}
                    />
                </div>
            }>
                {
                    imageLocation === IMAGE_LOCATION.Local && (
                        <Select options={imageOptions} placeholder="Select image" />
                    )
                }
                {
                    imageLocation === IMAGE_LOCATION.Remote && (
                        <Input placeholder="e.g., my-container" />
                    )
                }
            </Form.Item>
            <Form.Item name="restart_policy" label="Restart policy">
                <Select options={RESTART_POLICY} />
            </Form.Item>

        </>
    )
}
export default BasicForm