import { message } from 'antd';
import axios from 'axios';
import { useAtom } from 'jotai';
import { myStoreData, joinStoresData } from '../atoms/atoms';
import { handleApiError } from './handleApiError';
import { api_URL, useLogout } from './api';
import { useChangeProfile } from './useProfile';

export const useStoreProfile = () => {
	const { logout } = useLogout();
	const [, setStoreData] = useAtom(myStoreData);
	const [, setJoinStoresData] = useAtom(joinStoresData);
	const token = JSON.parse(localStorage.getItem('access_token')!);
	const { getProfile } = useChangeProfile();
	const getStore = async () => {
		try {
			const response = await axios.get(`${api_URL}/api/v1/stores`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.status === 200) {
				console.log(response.data);
				setStoreData(response.data);
			} else {
				throw new Error('Failed to fetch profile.');
			}
		} catch (error) {
			handleApiError(error, logout);
		}
	};

	const getStoresJoin = async () => {
		try {
			const response = await axios.get(`${api_URL}/api/v1/stores/join/`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.status === 200) {
				setJoinStoresData(response.data);
				console.log(response.data);
			} else {
				throw new Error('Failed to get stores join.');
			}
		} catch (error) {
			handleApiError(error, logout);
		}
	};

	const createStore = async (
		company_name: string,
		api_key: string,
		sellers_id: string,
		street: string,
		city: string,
		postal_code: string
	) => {
		try {
			const response = await axios.post(
				`${api_URL}/api/v1/stores`,
				{
					company_name,
					api_key,
					sellers_id,
					street,
					city,
					postal_code,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (response.status === 200) {
				message.success('Create store successfully.');
				await getStore();
				await getProfile();
			} else {
				throw new Error('Failed to create store.');
			}
		} catch (error) {
			handleApiError(error, logout);
		}
	};

	const deleteStoreProfile = async (id: number) => {
		try {
			const response = await axios.delete(`${api_URL}/api/v1/stores/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.status === 200) {
				message.success('Delete store successfully.');
				await getStore();
			} else {
				throw new Error('Failed to delete store.');
			}
		} catch (error) {
			handleApiError(error, logout);
		}
	};

	const joinStoreProfile = async (sellers_id: string) => {
		try {
			const response = await axios.post(
				`${api_URL}/api/v1/stores/join/`,
				{
					sellers_id,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.status === 200) {
				message.success('Store joined successfully.');
				await getStoresJoin();
			} else {
				throw new Error('Failed to join store.');
			}
		} catch (error) {
			handleApiError(error, logout);
		}
	};

	const changeStore = async (
		id: number,
		updatedFields: Partial<{
			company_name: string;
			api_key: string;
			sellers_id: string;
			street: string;
			city: string;
			postal_code: string;
		}>
	) => {
		try {
			const response = await axios.patch(
				`${api_URL}/api/v1/stores/${id}`,
				updatedFields,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.status === 200) {
				message.success('Store updated successfully.');
				await getStore();
			} else {
				throw new Error('Failed to update store.');
			}
		} catch (error) {
			handleApiError(error, logout);
		}
	};

	const handleDeleteRequest = async (id: number) => {
		try {
			const response = await axios.delete(
				`${api_URL}/api/v1/stores/join/${id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.status === 200) {
				message.success('Request delete successfully.');
				await getStoresJoin();
			} else {
				throw new Error('Failed to delete request.');
			}
		} catch (error) {
			handleApiError(error, logout);
		}
	};

	const handleRejectRequest = async (id: number) => {
		try {
			const response = await axios.patch(
				`${api_URL}/api/v1/stores/join/${id}`,
				{
					status: 'rejected',
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.status === 200) {
				message.success('Request rejected successfully.');
				await getStoresJoin();
			} else {
				throw new Error('Failed to reject request.');
			}
		} catch (error) {
			handleApiError(error, logout);
		}
	};

	const handleApproveRequest = async (id: number) => {
		try {
			const response = await axios.patch(
				`${api_URL}/api/v1/stores/join/${id}`,
				{
					status: 'accepted',
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.status === 200) {
				message.success('Request approved successfully.');
				await getStoresJoin();
			} else {
				throw new Error('Failed to approve request.');
			}
		} catch (error) {
			handleApiError(error, logout);
		}
	};

	return {
		createStore,
		getStore,
		getStoresJoin,
		deleteStoreProfile,
		joinStoreProfile,
		changeStore,
		handleDeleteRequest,
		handleRejectRequest,
		handleApproveRequest,
	};
};
