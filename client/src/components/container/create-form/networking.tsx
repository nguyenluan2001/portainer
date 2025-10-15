import { useQueryKeysFactory } from "@/hooks/react-query/useQueryKeysFactory"
import { getNetworkListProxy } from "@/services/proxy/networking"
import { PlusIcon, TrashIcon } from "@phosphor-icons/react"
import { useQuery } from "@tanstack/react-query"
import { Button, Form, Input, Select, type FormInstance, type FormListFieldData } from "antd"
import { useMemo, type FC } from "react"

interface Props {
    form: FormInstance<any>
}
const NetworkingForm: FC<Props> = ({ form }) => {
    const { networkKeys: { getNetworkList } } = useQueryKeysFactory()
    const { data } = useQuery({
        queryKey: getNetworkList(),
        queryFn: getNetworkListProxy
    })
    console.log('🚀 ===== NetworkingForm ===== data:', data);
    const options = useMemo(() => {
        return data?.networks.map((network) => ({
            label: `${network.Name} (${network.Driver})`,
            value: network.Id
        }))
    }, [data])
    return <Form.Item name="network_id" label="Network name">
        <Select options={options} defaultValue={options?.[0].value} />
    </Form.Item>
}

export default NetworkingForm