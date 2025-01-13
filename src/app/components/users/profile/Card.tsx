import { Button, Card } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useState } from 'react';
import {
	EditAndAddressModal,
	DeleteStoreModal,
	ManagersModal,
	NewStoreModal,
	JoinStoreModal,
} from '../../../components/users/profile/Modal';

interface Store {
	name: string;
	sellerId: string;
	apiKey: string;
}

const stores = [
	{
		name: 'test',
		sellerId: '12345',
		apiKey: 'b2c*******322',
	},
	{
		name: '321',
		sellerId: '43221',
		apiKey: 'b2c*******322',
	},
	{
		name: 'test2',
		sellerId: '22222',
		apiKey: 'b2c*******322',
	},
	{
		name: 'фывфыв',
		sellerId: 'фыв',
		apiKey: 'фыв*******фыв',
	},
];

export const CardStores = () => {
	const [isNewStoreModalOpen, setIsNewStoreModalOpen] =
		useState<boolean>(false);
	const [isJoinStoreModalOpen, setIsJoinStoreModalOpen] =
		useState<boolean>(false);

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
	const [deleteStore, setDeleteStore] = useState<string | null>(null);
	const [isEditAndAddressModalOpen, setIsisEditAndAddressModalOpen] =
		useState<boolean>(false);
	const [isManagersModalOpen, setIsManagersModalOpen] =
		useState<boolean>(false);
	const [managersStoreName, setManagersStoreName] = useState<string | null>();
	const [modalProps, setModalProps] = useState({
		title: '',
		firstLabel: '',
		secondLabel: '',
		thirdLabel: '',
		firstValue: '',
		secondValue: '',
		thirdValue: '',
	});

	const handleOpenModal = (store: Store, type: 'address' | 'edit') => {
		if (type === 'address') {
			setModalProps({
				title: `Edit Address of ${store.name}`,
				firstLabel: 'Street',
				secondLabel: 'City',
				thirdLabel: 'Postal Code',
				firstValue: 'None',
				secondValue: 'None',
				thirdValue: 'None',
			});
		} else if (type === 'edit') {
			setModalProps({
				title: `Edit store ${store.name}`,
				firstLabel: 'Company Name',
				secondLabel: 'Seller ID',
				thirdLabel: 'API Key',
				firstValue: `${store.name}`,
				secondValue: store.sellerId,
				thirdValue: store.apiKey,
			});
		}
		setIsisEditAndAddressModalOpen((prev) => !prev);
	};

	const handleCloseModal = () => {
		setIsisEditAndAddressModalOpen(false);
		setModalProps({
			title: '',
			firstLabel: '',
			secondLabel: '',
			thirdLabel: '',
			firstValue: '',
			secondValue: '',
			thirdValue: '',
		});
	};

	const handleOpenDeleteModal = (storeName: string) => {
		setDeleteStore(storeName);
		setIsDeleteModalOpen((prev) => !prev);
	};

	const handleCloseDeleteModal = () => {
		setDeleteStore(null);
		setIsDeleteModalOpen((prev) => !prev);
	};

	const handleDeleteStore = () => {
		console.log(`Deleted store: ${deleteStore}`);
		handleCloseDeleteModal();
	};

	const handleOpenManagersModal = (storeName: string) => {
		setManagersStoreName(storeName);
		setIsManagersModalOpen((prev) => !prev);
	};

	return (
		<div className="space-y-1 bg-white rounded-lg p-4">
			{stores.map((store, index) => (
				<div className="flex justify-center" key={index}>
					<Card className="shadow-sm w-4/6">
						<div className="flex flex-col md:flex-row md:justify-between md:items-center">
							<div>
								<h3 className="text-lg font-semibold">Store: {store.name}</h3>
								<p className="text-gray-600">Seller ID: {store.sellerId}</p>
								<p className="text-gray-600">API Key: {store.apiKey}</p>
							</div>
							<div className="flex flex-col md:flex-row md:gap-2 mt-2 md:mt-0">
								<Button
									type="primary"
									className="bg-blue-500 w-full md:w-auto"
									onClick={() => handleOpenModal(store, 'address')}
								>
									Address
								</Button>
								<br />
								<div className="flex justify-around md:gap-4">
									<Button
										icon={<EditOutlined />}
										className="bg-yellow-500 text-white w-full md:w-auto"
										onClick={() => handleOpenModal(store, 'edit')} //
									/>
									<Button
										danger
										icon={<DeleteOutlined />}
										onClick={() => handleOpenDeleteModal(store.name)}
										className="w-full md:w-auto"
									/>
								</div>
								<br />
								<Button
									className="w-full md:w-auto"
									onClick={() => {
										handleOpenManagersModal(store.name);
									}}
								>
									Managers
								</Button>
							</div>
						</div>
					</Card>
				</div>
			))}
			<br />
			<div className="flex flex-col md:flex-row gap-2 justify-center">
				<Button
					type="primary"
					className="bg-green-500 w-full md:w-auto"
					onClick={() => setIsNewStoreModalOpen((prev) => !prev)}
				>
					Create New Store
				</Button>
				<Button
					className="w-full md:w-auto"
					onClick={() => setIsJoinStoreModalOpen((prev) => !prev)}
				>
					Join Existing Store
				</Button>
			</div>

			{isEditAndAddressModalOpen && (
				<EditAndAddressModal
					{...modalProps}
					open={isEditAndAddressModalOpen}
					onClose={handleCloseModal}
				/>
			)}
			{isDeleteModalOpen && (
				<DeleteStoreModal
					open={isDeleteModalOpen}
					onOk={handleDeleteStore}
					onCancel={handleCloseDeleteModal}
					storeName={deleteStore || ''}
				/>
			)}
			{isManagersModalOpen && (
				<ManagersModal
					open={isManagersModalOpen}
					onClose={() => setIsManagersModalOpen((prev) => !prev)}
					storeName={managersStoreName || ''}
				/>
			)}
			{isNewStoreModalOpen && (
				<NewStoreModal
					open={isNewStoreModalOpen}
					onClose={() => setIsNewStoreModalOpen((prev) => !prev)}
				/>
			)}
			{isJoinStoreModalOpen && (
				<JoinStoreModal
					open={isJoinStoreModalOpen}
					onCancel={() => setIsJoinStoreModalOpen((prev) => !prev)}
					onOk={(values) => {
						console.log(values);
					}}
				/>
			)}
		</div>
	);
};
