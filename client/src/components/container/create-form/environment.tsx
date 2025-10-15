import { PlusIcon, TrashIcon } from "@phosphor-icons/react"
import { Button, Form, Input, Select, type FormInstance, type FormListFieldData } from "antd"
import type { FC } from "react"

interface Props {
    form: FormInstance<any>
}
const EnvironmentForm: FC<Props> = ({ form }) => {
    return <Form.List name="environments">
        {(fields, { add, remove }) => {
            return <div className="flex flex-col gap-2">
                {
                    fields?.map((field, index) => (
                        <EnvironmentItem field={field} onRemove={() => remove(index)} index={index} />
                    ))
                }
                <Button className="w-full" icon={<PlusIcon />} onClick={() => add({
                    key: null,
                    value: null,
                })}>Add environment variable</Button>
            </div>
        }}
    </Form.List>
}

interface EnvironmentItemProps {
    field: FormListFieldData
    index: number,
    onRemove: () => void,
}
const EnvironmentItem: FC<EnvironmentItemProps> = ({ field, index, onRemove }) => {
    return <div className="flex items-end gap-2">
        <Form.Item label={index === 0 && "Key"} name={[field.name, 'key']} className="grow !mb-0">
            <Input placeholder="eg.,API_KEY" />
        </Form.Item>
        <Form.Item label={index === 0 && "Value"} name={[field.name, 'value']} className="grow !mb-0">
            <Input placeholder="eg.,abc123" />
        </Form.Item>
        <Button icon={<TrashIcon />} onClick={onRemove} />
    </div>
}
export default EnvironmentForm