import { PlusCircleIcon } from "@phosphor-icons/react"
import { Button, Form, Modal } from "antd"
import { useForm } from "antd/es/form/Form"
import { useState } from "react"
import BasicForm from "./basic"

const CreateContainerForm = () => {
    const [form] = useForm()
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button icon={<PlusCircleIcon />} onClick={() => setOpen(true)} >Create container</Button>
            <Modal open={open} onCancel={() => setOpen(false)}>
                <Form form={form} layout="vertical">
                    <BasicForm form={form} />
                </Form>
            </Modal>
        </>
    )
}

export default CreateContainerForm