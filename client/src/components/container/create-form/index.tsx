import { CaretDownIcon, PlusCircleIcon } from "@phosphor-icons/react"
import { Button, Dropdown, Form, Modal, Segmented, type MenuProps } from "antd"
import { useForm } from "antd/es/form/Form"
import { useState } from "react"
import BasicForm from "./basic"
import { useMutation } from "@tanstack/react-query"
import PortForm from "./port"
import VolumeForm from "./volume"
import EnvironmentForm from "./environment"
import NetworkingForm from "./networking"
import { IMAGE_LOCATION } from "@/constant/container"
import FormWrapper from "./form-wrapper"

const TAB_LIST = {
    Basic: 'Basic',
    Ports: 'Ports',
    Volumes: 'Volumes',
    Environments: 'Environments',
    Networking: 'Networking',
    Advanced: 'Advanced',
}
const CREATE_OPTIONS = [
    // {
    //     key: false,
    //     label: 'Create',
    // },
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

    const onCreateContainer = (isStart = false) => {
        form.setFieldValue('isStart', isStart)
        form.submit()
    }

    const onSubmit = async (values: any) => {
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
                        <Dropdown.Button className="!w-fit" type="primary" icon={<CaretDownIcon />} onClick={() => onCreateContainer()} menu={{ items: CREATE_OPTIONS as any[], onClick: () => onCreateContainer(true) }}>Create</Dropdown.Button>

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
                            restart_policy: 'No',
                            ports: [{
                                host: null,
                                container: null,
                                protocol: "tcp"
                            }],
                            volumes: [{
                                host: null,
                                container: null,
                            }],
                            environments: [{
                                key: null,
                                value: null,
                            }],
                            networking: "bridge",
                            imageLocation: IMAGE_LOCATION.Local

                        }}
                        onFinish={onSubmit}
                    >
                        <Form.Item hidden name="isStart" />
                        <FormWrapper isActive={activeTab === TAB_LIST.Basic}>
                            <BasicForm form={form} />
                        </FormWrapper>
                        <FormWrapper isActive={activeTab === TAB_LIST.Ports}>
                            <PortForm form={form} />
                        </FormWrapper>
                        <FormWrapper isActive={activeTab === TAB_LIST.Volumes}>
                            <VolumeForm form={form} />
                        </FormWrapper>
                        <FormWrapper isActive={activeTab === TAB_LIST.Environments}>
                            <EnvironmentForm form={form} />
                        </FormWrapper>
                        <FormWrapper isActive={activeTab === TAB_LIST.Networking}>
                            <NetworkingForm form={form} />
                        </FormWrapper>
                    </Form>
                </div>
            </Modal>
        </>
    )
}

export default CreateContainerForm