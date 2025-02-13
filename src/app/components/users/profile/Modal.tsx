'use client';

import { useStoreProfile } from '@/app/api/api';
import { Modal, Form, Input, Button } from 'antd';
import { useAtom } from 'jotai';
import { joinStoresData } from '@/app/atoms/atoms';

interface IEditAndAddressModal {
	title: string;
	firstLabel: string;
	secondLabel: string;
	thirdLabel: string;
	firstValue: string;
	secondValue: string;
	thirdValue: string;
	id: number;
	open: boolean;
	onClose: () => void;
}

interface INewAndJoinStoreModalProps {
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

interface IJoinStoreModalProps {
	open: boolean;
	onOk: (values: { sellerId: string }) => void;
	onCancel: () => void;
}

export const EditAndAddressModal = ({
	title,
	firstLabel,
	secondLabel,
	thirdLabel,
	firstValue,
	secondValue,
	thirdValue,
	open,
	onClose,
	id,
}: IEditAndAddressModal) => {
	const { changeStore } = useStoreProfile();
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

				// Маппинг меток на ключи API
				const fieldMapping = {
					'Company Name': 'company_name',
					'API Key': 'api_key',
					'Seller ID': 'sellers_id',
					Street: 'street',
					City: 'city',
					'Postal Code': 'postal_code',
				};

				// Преобразуем значения формы в объект с ключами для API
				const updatedFields = Object.keys(values).reduce((acc, key) => {
					const apiKey = fieldMapping[key];
					if (apiKey) acc[apiKey] = values[key]; // Добавляем только заполненные поля
					return acc;
				}, {});

				// Передаем id и обновленные поля в changeStore
				changeStore(id, updatedFields);
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
	const [joinStores] = useAtom(joinStoresData);

	const managers = joinStores.filter(
		(request: { status: string; store: { company_name: string } }) =>
			request.status === 'accepted' && request.store.company_name === storeName
	);

	return (
		<Modal
			title={`Managers of Store: ${storeName}?`}
			open={open}
			closable={true}
			footer={null}
			onCancel={onClose}
		>
			{managers.length > 0 ? (
				<ul className="list-disc pl-4">
					{managers.map((manager) => (
						<li key={manager.id} className="text-[#012970] font-semibold">
							{manager.user.username}
						</li>
					))}
				</ul>
			) : (
				<p>No managers assigned to this store.</p>
			)}
		</Modal>
	);
};

export const NewStoreModal = ({
	open,
	onClose,
}: INewAndJoinStoreModalProps) => {
	const { createStore } = useStoreProfile();
	const [form] = Form.useForm();

	const handleOk = () => {
		const values = form.getFieldsValue();
		createStore(
			values.companyName,
			values.apiKey,
			values.sellerId,
			values.storeStreet,
			values.storeCity,
			values.storePostalCode
		);
		setTimeout(() => {
			onClose();
		}, 2000);
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

export const JoinStoreModal = ({
	open,
	onOk,
	onCancel,
}: IJoinStoreModalProps) => {
	const [form] = Form.useForm();

	const handleOk = () => {
		form
			.validateFields()
			.then((values) => {
				onOk(values);
				form.resetFields();
			})
			.catch((info) => {
				console.error('Validation failed:', info);
			});
	};

	return (
		<Modal
			title="Join Store"
			open={open}
			onCancel={onCancel}
			footer={[
				<Button
					key="submit"
					type="primary"
					onClick={handleOk}
					className="bg-blue-500 text-white"
				>
					Join Store
				</Button>,
			]}
		>
			<p>Enter store information to join.</p>
			<Form form={form} layout="vertical">
				<Form.Item
					label="Store Seller ID"
					name="sellerId"
					rules={[{ required: true, message: 'Please enter Store Seller ID' }]}
				>
					<Input placeholder="Enter Store Seller ID" />
				</Form.Item>
			</Form>
		</Modal>
	);
};
