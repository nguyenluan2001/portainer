import { CaretDownIcon, PlusCircleIcon } from "@phosphor-icons/react"
import { Button, Dropdown, Form, Modal, Segmented, type MenuProps } from "antd"
import { useForm } from "antd/es/form/Form"
import { useState } from "react"
import BasicForm from "./basic"
import { useMutation } from "@tanstack/react-query"

const TAB_LIST = {
    Basic: 'Basic',
    Ports: 'Ports',
    Volumes: 'Volumes',
    Environment: 'Environment',
    Network: 'Network',
    Advanced: 'Advanced',
}
const CREATE_OPTIONS = [
    {
        key: false,
        label: 'Create',
    },
    {
        key: true,
        label: 'Create and run',
    },
];
const CreateContainerForm = () => {
    const [form] = useForm()
    const [open, setOpen] = useState(false)
    const [activeTab, setActiveTab] = useState(TAB_LIST.Basic)

    const createMutation = useMutation({
        // mutationFn:(params) => createCon
    })

    const onCreateContainer: MenuProps['onClick'] = (e) => {
        console.log('🚀 ===== onCreateContainer ===== e:', e);
        form.setFieldValue('isStart', e.key === 'true')
        form.submit()
    }

    const onSubmit = async (values) => {
        console.log('🚀 ===== onSubmit ===== values:', values);

    }

    return (
        <>
            <Button icon={<PlusCircleIcon />} onClick={() => setOpen(true)}
            >Create container</Button>
            <Modal title="Create container"
                footer={
                    <div className="w-full flex items-center justify-end gap-2">
                        <Button>Cancel</Button>
                        <Dropdown.Button className="!w-fit" type="primary" icon={<CaretDownIcon />} menu={{ items: CREATE_OPTIONS, onClick: onCreateContainer }}>Create</Dropdown.Button>

                    </div>
                }
                open={open} onCancel={() => setOpen(false)}>
                <div className="w-full h-full flex flex-col gap-3">
                    <Segmented
                        options={Object.keys(TAB_LIST)}
                        onChange={(value) => {
                            setActiveTab(value)
                        }}
                        value={activeTab}
                    />
                    <Form form={form} layout="vertical"
                        initialValues={{
                            restart_policy: 'No'

                        }}
                        onFinish={onSubmit}
                    >
                        <Form.Item hidden name="isStart" />
                        {
                            activeTab === TAB_LIST.Basic && (
                                <BasicForm form={form} />
                            )
                        }
                    </Form>
                </div>
            </Modal>
        </>
    )
}

export default CreateContainerForm