import { PlusIcon, TrashIcon } from "@phosphor-icons/react"
import { Button, Form, Input, Select, type FormInstance, type FormListFieldData } from "antd"
import type { FC } from "react"

interface Props {
    form: FormInstance<any>
}
const PortForm: FC<Props> = ({ form }) => {
    return <Form.List name="ports">
        {(fields, { add, remove }) => {
            return <div className="flex flex-col gap-2">
                {
                    fields?.map((field, index) => (
                        <PortItem field={field} onRemove={() => remove(index)} index={index} />
                    ))
                }
                <Button className="w-full" icon={<PlusIcon />} onClick={() => add({
                    host: null,
                    container: null,
                    protocol: "tcp"
                })}>Add port mapping</Button>
            </div>
        }}
    </Form.List>
}

interface PortItemProps {
    field: FormListFieldData
    index: number,
    onRemove: () => void,
}
const PortItem: FC<PortItemProps> = ({ field, index, onRemove }) => {
    const PROTOCOL_OPTIONS = [
        {
            label: "TCP",
            value: "tcp"
        },
        {
            label: "UDP",
            value: "udp"
        }
    ]
    return <div className="flex items-end gap-2">
        <Form.Item label={index === 0 && "Host port"} name={[field.name, 'host']} className="grow !mb-0">
            <Input placeholder="eg.,80" />
        </Form.Item>
        <Form.Item label={index === 0 && "Container port"} name={[field.name, 'container']} className="grow !mb-0">
            <Input placeholder="eg.,80" />
        </Form.Item>
        <Form.Item label={index === 0 && "Protocol"} name={[field.name, 'protocol']} className="grow !mb-0">
            <Select options={PROTOCOL_OPTIONS} />
        </Form.Item>
        <Button icon={<TrashIcon />} onClick={onRemove} />
    </div>
}
export default PortForm