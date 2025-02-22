'use client';

import { Button, Card } from 'antd';
import { CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useState } from 'react';
import {
	EditAndAddressModal,
	DeleteStoreModal,
	ManagersModal,
	NewStoreModal,
	JoinStoreModal,
} from '../../../components/users/profile/Modal';
import { useStoreProfile } from '@/app/api/useStore';
import { useAtom } from 'jotai';
import { myStoreData, joinStoresData } from '../../../atoms/atoms';

interface JoinStoreRequest {
	id: number;
	status: string;
	owner: boolean;
	store: {
		company_name: string;
	};
	user: {
		username: string;
	};
}

interface Store {
	company_name: string;
	sellers_id: string;
	api_key: string;
	postal_code?: string;
	street?: string;
	city?: string;
	id?: number;
}

export const CardStores = () => {
	const [isNewStoreModalOpen, setIsNewStoreModalOpen] = useState(false);
	const [isJoinStoreModalOpen, setIsJoinStoreModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isEditAndAddressModalOpen, setIsEditAndAddressModalOpen] =
		useState(false);
	const [isManagersModalOpen, setIsManagersModalOpen] = useState(false);
	const [deleteStore, setDeleteStore] = useState<Store | null>(null);
	const [managersStoreName, setManagersStoreName] = useState<string | null>(
		null
	);
	const [modalProps, setModalProps] = useState({
		title: '',
		firstLabel: '',
		secondLabel: '',
		thirdLabel: '',
		firstValue: '',
		secondValue: '',
		thirdValue: '',
	});
	const [stores, setStores] = useAtom(myStoreData);
	const [joinStores] = useAtom(joinStoresData);
	const {
		deleteStoreProfile,
		joinStoreProfile,
		handleApproveRequest,
		handleRejectRequest,
		handleDeleteRequest,
	} = useStoreProfile();

	const handleOpenModal = (store: Store, type: 'address' | 'edit') => {
		setModalProps({
			title:
				type === 'address'
					? `Edit address of ${store.company_name}`
					: `Edit store ${store.company_name}`,
			firstLabel: type === 'address' ? 'Street' : 'Company Name',
			secondLabel: type === 'address' ? 'City' : 'Seller ID',
			thirdLabel: type === 'address' ? 'Postal Code' : 'API Key',
			firstValue: type === 'address' ? store.street || '' : store.company_name,
			secondValue: type === 'address' ? store.city || '' : store.sellers_id,
			thirdValue: type === 'address' ? store.postal_code || '' : store.api_key, //@ts-ignore
			id: store.id || null,
		});
		setIsEditAndAddressModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsEditAndAddressModalOpen(false);
	};

	const handleOpenDeleteModal = (store: Store) => {
		setDeleteStore(store);
		setIsDeleteModalOpen(true);
	};

	const handleCloseDeleteModal = () => {
		setDeleteStore(null);
		setIsDeleteModalOpen(false);
	};

	const handleDeleteStore = (id: number) => {
		deleteStoreProfile(id)
			.then(() => {
				setStores((prev) =>
					Array.isArray(prev) ? prev.filter((store) => store.id !== id) : prev
				);
				handleCloseDeleteModal();
			})
			.catch((err) => {
				console.error('Failed to delete store:', err);
			});
	};

	const handleOpenManagersModal = (storeName: string) => {
		setManagersStoreName(storeName);
		setIsManagersModalOpen(true);
	};

	const handleCloseNewStoresModal = () => {
		setIsNewStoreModalOpen(false);
	};

	const joinStore = (values: { sellerId: string }) => {
		joinStoreProfile(values.sellerId)
			.then((newStore) => {
				//@ts-ignore
				setStores((prev) => [newStore, ...prev]);
				setIsJoinStoreModalOpen(false);
			})
			.catch((err) => console.error('Failed to join store:', err));
	};

	return (
		<div className="space-y-4 bg-white rounded-lg p-4">
			{Array.isArray(joinStores) &&
				joinStores
					.filter(
						(request: JoinStoreRequest) =>
							request.status !== 'accepted' && request.status !== 'rejected'
					)
					.map((request: JoinStoreRequest) =>
						!request.owner ? (
							<div className="flex justify-center" key={request.id}>
								<Card className="shadow-sm w-4/6 text-center relative">
									<CloseOutlined
										className="absolute top-2 right-2 text-xl text-red-600 cursor-pointer"
										onClick={() => handleDeleteRequest(request.id)}
									/>
									<h3 className="text-base text-[#012970]">
										Your join request to the store "{request.store.company_name}
										" is pending approval from the store owner.
									</h3>
								</Card>
							</div>
						) : null
					)}

			{Array.isArray(joinStores) &&
				joinStores.filter(
					(request: JoinStoreRequest) =>
						request.owner &&
						request.status !== 'accepted' &&
						request.status !== 'rejected'
				).length > 0 && (
					<div className="space-y-4">
						<h2 className="text-xl text-center font-semibold">
							Pending Join Requests
						</h2>
						{joinStores
							.filter(
								(request: JoinStoreRequest) =>
									request.owner &&
									request.status !== 'accepted' &&
									request.status !== 'rejected'
							)
							.map((request: JoinStoreRequest) => (
								<div className="flex justify-center" key={request.id}>
									<Card className="shadow-sm w-4/6">
										<div className="flex flex-col md:flex-row md:justify-between md:items-center">
											<h3 className="text-lg text-[#012970] font-semibold">
												{request.user.username} wants to join{' '}
												{request.store.company_name}
											</h3>
											<div className="flex flex-col md:flex-row md:gap-2 mt-2 md:mt-0">
												<Button
													type="primary"
													className="bg-green-500 w-full md:w-auto"
													onClick={() => handleApproveRequest(request.id)}
												>
													Approve
												</Button>
												<Button
													danger
													className="w-full md:w-auto"
													onClick={() => handleRejectRequest(request.id)}
												>
													Reject
												</Button>
											</div>
										</div>
									</Card>
								</div>
							))}
					</div>
				)}

			{Array.isArray(stores) &&
			stores.length > 0 &&
			stores.some((store) => store !== null) ? (
				<>
					<h2 className="text-xl text-center font-semibold">Your Stores</h2>
					{[...stores].reverse().map((store) => {
						if (!store) return null;
						return (
							<div
								className="flex justify-center"
								key={store?.id || Math.random()}
							>
								<Card className="shadow-sm w-4/6">
									<div className="flex flex-col md:flex-row md:justify-between md:items-center">
										<div>
											<h3 className="text-lg text-[#012970] font-semibold truncate max-w-[20ch]">
												Store: {store?.company_name ?? 'Unknown'}
											</h3>
											<p className="text-gray-600 truncate max-w-[20ch]">
												Seller ID: {store?.sellers_id ?? 'N/A'}
											</p>
											<p className="text-gray-600 truncate max-w-[30ch]">
												API Key: {store?.api_key ?? 'N/A'}
											</p>
										</div>
										<div className="flex flex-col mt-2 lg:flex-row lg:gap-2 lg:mt-0">
											<Button
												type="primary"
												className="bg-blue-500 w-full md:w-auto"
												onClick={() => handleOpenModal(store, 'address')}
											>
												Address
											</Button>
											<div className="flex justify-around md:gap-4">
												<Button
													icon={<EditOutlined />}
													className="bg-yellow-500 text-white w-full md:w-auto"
													onClick={() => handleOpenModal(store, 'edit')}
												/>
												<Button
													danger
													icon={<DeleteOutlined />}
													onClick={() => handleOpenDeleteModal(store)}
													className="w-full md:w-auto"
												/>
											</div>
											<Button
												className="w-full md:w-auto"
												onClick={() =>
													handleOpenManagersModal(store?.company_name)
												}
											>
												Managers
											</Button>
										</div>
									</div>
								</Card>
							</div>
						);
					})}
				</>
			) : Array.isArray(joinStores) &&
			  joinStores.filter((request: JoinStoreRequest) => request.owner)
					.length === 0 &&
			  stores.length === 0 ? (
				<div className="text-center text-gray-600">
					You don't have join requests and stores.
				</div>
			) : null}
			<br />
			<br />
			<div className="flex flex-col md:flex-row gap-2 justify-center">
				<Button
					type="primary"
					className="bg-green-500 w-full md:w-auto"
					onClick={() => setIsNewStoreModalOpen(true)}
				>
					Create New Store
				</Button>
				<Button
					className="w-full md:w-auto"
					onClick={() => setIsJoinStoreModalOpen(true)}
				>
					Join Existing Store
				</Button>
			</div>

			{isEditAndAddressModalOpen && (
				<EditAndAddressModal
					id={0}
					{...modalProps}
					open={isEditAndAddressModalOpen}
					onClose={handleCloseModal}
				/>
			)}
			{isDeleteModalOpen && (
				<DeleteStoreModal
					open={isDeleteModalOpen}
					onOk={() => handleDeleteStore(deleteStore!.id!)}
					onCancel={handleCloseDeleteModal}
					storeName={deleteStore?.company_name || ''}
				/>
			)}
			{isManagersModalOpen && (
				<ManagersModal
					open={isManagersModalOpen}
					onClose={() => setIsManagersModalOpen(false)}
					storeName={managersStoreName || ''}
				/>
			)}
			{isNewStoreModalOpen && (
				<NewStoreModal
					open={isNewStoreModalOpen}
					onClose={handleCloseNewStoresModal}
				/>
			)}
			{isJoinStoreModalOpen && (
				<JoinStoreModal
					open={isJoinStoreModalOpen}
					onCancel={() => setIsJoinStoreModalOpen(false)}
					onOk={(values) => joinStore(values)}
				/>
			)}
		</div>
	);
};
