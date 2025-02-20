import { message } from 'antd';
import axios from 'axios';
import { useAtom } from 'jotai';
import { myProfileData } from '../atoms/atoms';
import { useLogout, USERS_URL } from './api';
import { handleApiError } from './handleApiError';

export const useChangeProfile = () => {
	const [, setProfileData] = useAtom(myProfileData);
	const { logout } = useLogout();
	const token = JSON.parse(localStorage.getItem('access_token')!);

	const getProfile = async () => {
		try {
			const response = await axios.get(`${USERS_URL}/users/me`, {
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
				`${USERS_URL}/users/me`,
				{ active_store_id: id },
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
		first_name: string,
		last_name: string,
		photo: string,
		phone: string
	) => {
		try {
			const response = await axios.patch(
				`${USERS_URL}/users/me`,
				{
					first_name,
					last_name,
					photo,
					phone,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
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
