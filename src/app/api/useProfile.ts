import { message } from 'antd';
import axios from 'axios';
import { useAtom } from 'jotai';
import { myProfileData } from '../atoms/atoms';
import { useLogout, USERS_URL } from './api';
import { handleApiError } from './handleApiError';

export const useChangeProfile = () => {
	const [, setProfileData] = useAtom(myProfileData);
	const { logout } = useLogout();
	let token: string | null = null;

	if (typeof window !== 'undefined') {
		token = JSON.parse(localStorage.getItem('access_token')!);
	}

	const getProfile = async () => {
		try {
			const response = await axios.get(`${USERS_URL}/api/v1/jwt/users/me/`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.status === 200) {
				console.log(response.data);
				setProfileData(response.data);
				return response.data;
			} else {
				throw new Error('Failed to fetch profile.');
			}
		} catch (error) {
			handleApiError(error, logout);
		}
	};

	const selectStore = async (id: number) => {
		try {
			const response = await axios.patch(
				`${USERS_URL}/api/v1/jwt/users/me/?active_store_id=${id}`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.status === 200) {
				console.log(response.data);
				await getProfile();
				message.success('Active store set successfully.');
			} else {
				throw new Error('Failed to set active store.');
			}
		} catch (error) {
			handleApiError(error, logout);
		}
	};

	const changeProfile = async (
		first_name?: string,
		last_name?: string,
		photo?: File,
		phone?: string,
		active_store_id?: number
	) => {
		try {
			const formData = new FormData();

			if (photo) formData.append('photo', photo);

			const params = new URLSearchParams();
			if (first_name) params.append('first_name', first_name);
			if (last_name) params.append('last_name', last_name);
			if (phone) params.append('phone', phone);
			if (active_store_id !== undefined)
				params.append('active_store_id', active_store_id.toString());

			const response = await axios.patch(
				`${USERS_URL}/api/v1/jwt/users/me/?${params.toString()}`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'multipart/form-data',
					},
				}
			);

			if (response.status === 200) {
				message.success('Profile updated successfully.');
				await getProfile();
			} else if (response.status === 401) {
				logout();
			} else {
				throw new Error('Failed to update profile.');
			}
		} catch (error) {
			handleApiError(error, logout);
		}
	};

	return { changeProfile, getProfile, selectStore };
};
