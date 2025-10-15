import { PlusIcon, TrashIcon } from "@phosphor-icons/react"
import { Button, Form, Input, Select, type FormInstance, type FormListFieldData } from "antd"
import type { FC } from "react"

interface Props {
    form: FormInstance<any>
}
const VolumeForm: FC<Props> = ({ form }) => {
    return <Form.List name="volumes">
        {(fields, { add, remove }) => {
            return <div className="flex flex-col gap-2">
                {
                    fields?.map((field, index) => (
                        <VolumeItem field={field} onRemove={() => remove(index)} index={index} />
                    ))
                }
                <Button className="w-full" icon={<PlusIcon />} onClick={() => add({
                    host: null,
                    container: null,
                })}>Add volume mount</Button>
            </div>
        }}
    </Form.List>
}

interface VolumeItemProps {
    field: FormListFieldData
    index: number,
    onRemove: () => void,
}
const VolumeItem: FC<VolumeItemProps> = ({ field, index, onRemove }) => {
    return <div className="flex items-end gap-2">
        <Form.Item label={index === 0 && "Host path/Volume"} name={[field.name, 'host']} className="grow !mb-0">
            <Input placeholder="eg.,/path/on/host" />
        </Form.Item>
        <Form.Item label={index === 0 && "Container path"} name={[field.name, 'container']} className="grow !mb-0">
            <Input placeholder="eg.,/path/on/container" />
        </Form.Item>
        <Button icon={<TrashIcon />} onClick={onRemove} />
    </div>
}
export default VolumeForm