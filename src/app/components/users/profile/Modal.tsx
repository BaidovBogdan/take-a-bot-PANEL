'use client';

import { Modal, Form, Input } from 'antd';

interface IModal {
	title: string;
	firstLabel: string;
	secondLabel: string;
	thirdLabel: string;
	firstValue: string;
	secondValue: string;
	thirdValue: string;
	open: boolean;
	onClose: () => void;
}

interface INewStoreModalProps {
	open: boolean;
	onClose: () => void;
}

interface IDeleteStoreModalProps {
	open: boolean;
	onOk: () => void;
	onCancel: () => void;
	storeName: string;
}

interface IManagersModalProps {
	open: boolean;
	storeName: string;
	onClose: () => void;
}

export const ModalForAddressAndEdit = ({
	title,
	firstLabel,
	secondLabel,
	thirdLabel,
	firstValue,
	secondValue,
	thirdValue,
	open,
	onClose,
}: IModal) => {
	const [form] = Form.useForm();

	form.setFieldsValue({
		[firstLabel]: firstValue || '',
		[secondLabel]: secondValue || '',
		[thirdLabel]: thirdValue || '',
	});

	const handleOk = () => {
		form
			.validateFields()
			.then((values) => {
				console.log('Saved values:', values);
				onClose();
			})
			.catch((info) => {
				console.log('Validation failed:', info);
			});
	};

	return (
		<Modal
			title={title || 'Edit Address'}
			open={open}
			onOk={handleOk}
			onCancel={onClose}
			okText="Save Changes"
		>
			<Form form={form} layout="vertical">
				<Form.Item
					label={firstLabel || 'Field 1'}
					name={firstLabel}
					rules={[{ required: true, message: `Please enter ${firstLabel}` }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label={secondLabel || 'Field 2'}
					name={secondLabel}
					rules={[{ required: true, message: `Please enter ${secondLabel}` }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label={thirdLabel || 'Field 3'}
					name={thirdLabel}
					rules={[{ required: true, message: `Please enter ${thirdLabel}` }]}
				>
					<Input />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export const DeleteStoreModal = ({
	open,
	onOk,
	onCancel,
	storeName,
}: IDeleteStoreModalProps) => {
	const handleOk = () => {};

	const handleCancel = () => {};

	return (
		<Modal
			title={`Delete Store ${storeName}?`}
			open={open}
			onOk={onOk}
			onCancel={onCancel}
			okText="Delete"
			cancelText="Cancel"
			okButtonProps={{ danger: true }}
		>
			<p>
				Are you sure you want to delete this store? This action cannot be
				undone.
			</p>
		</Modal>
	);
};

export const ManagersModal = ({
	open,
	storeName,
	onClose,
}: IManagersModalProps) => {
	return (
		<Modal
			title={`Managers of Store: ${storeName}?`}
			open={open}
			closable={true}
			footer={null}
			onCancel={onClose}
		>
			<p>No managers assigned to this store.</p>
		</Modal>
	);
};

export const NewStoreModal = ({ open, onClose }: INewStoreModalProps) => {
	const [form] = Form.useForm();

	const handleOk = () => {
		form
			.validateFields()
			.then((values) => {
				console.log('Saved values:', values);
				form.resetFields();
				onClose();
			})
			.catch((info) => {
				console.log('Validation failed:', info);
			});
	};

	return (
		<Modal title="Add Store" open={open} onOk={handleOk} onCancel={onClose}>
			<Form form={form} layout="vertical">
				<Form.Item
					label="Company name"
					name="companyName"
					rules={[{ required: true, message: 'Please enter store name' }]}
				>
					<Input placeholder="Enter store name" />
				</Form.Item>
				<Form.Item
					label="Api key"
					name="apiKey"
					rules={[{ required: true, message: 'Please enter API key' }]}
				>
					<Input placeholder="Enter API key" />
				</Form.Item>
				<Form.Item
					label="Sellers id"
					name="sellerId"
					rules={[{ required: true, message: 'Please enter sellers ID' }]}
				>
					<Input placeholder="Enter sellers ID" />
				</Form.Item>
				<Form.Item label="Store Street" name="storeStreet">
					<Input placeholder="Enter store street" />
				</Form.Item>
				<Form.Item label="Store City" name="storeCity">
					<Input placeholder="Enter store city" />
				</Form.Item>
				<Form.Item label="Store Postal Code" name="storePostalCode">
					<Input placeholder="Enter postal code" />
				</Form.Item>
			</Form>
		</Modal>
	);
};
