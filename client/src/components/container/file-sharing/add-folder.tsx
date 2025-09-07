import { Form, Input, Modal, type InputRef } from "antd";
import { useForm } from "antd/es/form/Form";
import { useRef, useState, type FC } from "react";

interface Props {
	open: boolean;
	isLoading: boolean;
	onClose: () => void;
	onAdd: (name: string) => void;
}
const ModalAddFolder: FC<Props> = ({ open, isLoading, onClose, onAdd }) => {
	const [form] = useForm();

	const onFinish = (v: any) => {
		onAdd(v?.name);
		form.resetFields();
	};
	return (
		<>
			<Modal
				centered={true}
				title="Enter a new name"
				open={open}
				onCancel={onClose}
				okText="Add"
				onOk={form.submit}
				loading={isLoading}
			>
				<Form form={form} onFinish={onFinish} validateTrigger="onSubmit">
					<Form.Item
						name="name"
						rules={[
							{
								required: true,
								validator(rule, value, callback) {
									if (value?.includes(" "))
										return callback("Name must not contain white space.");
									return Promise.resolve();
								},
							},
						]}
					>
						<Input />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};
export default ModalAddFolder;
