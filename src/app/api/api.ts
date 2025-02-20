import { useAtom } from 'jotai';
import { message } from 'antd';
import axios from 'axios';
import {
	accessTokenAtom,
	myProfileData,
	myStoreData,
	myOffersData,
	burgerCheckAtom,
	joinStoresData,
	mySalesData,
	DashboardData,
	filteredCheckBoxs,
	selectedStore,
} from '../atoms/atoms';
import { useRouter } from 'next/navigation';
import { handleApiError } from './handleApiError';

export const USERS_URL = 'http://35.232.222.207';
export const api_URL = 'http://34.44.207.107';

export const useRequestVerifyToken = () => {
	const { logout } = useLogout();
	const requestVerifyToken = async (email: string) => {
		try {
			const response = await axios.post(
				`${USERS_URL}/auth/request-verify-token`,
				{ email }
			);
			if (response.status === 202) {
				message.success('Verification email has been sent!');
				return response.data;
			}
			throw new Error('Failed to send verification request');
		} catch (error) {
			handleApiError(error, logout);
		}
	};

	return { requestVerifyToken };
};

export const useLogout = () => {
	const [, setAccessTokenAtom] = useAtom(accessTokenAtom);
	const [, setStoreData] = useAtom(myStoreData);
	const [, setOffersData] = useAtom(myOffersData);
	const [, setProfileData] = useAtom(myProfileData);
	const [, setJoinStoresData] = useAtom(joinStoresData);
	const [, setSalesData] = useAtom(mySalesData);
	const [, setDashboardData] = useAtom(DashboardData);
	const [, setFilteredCheckboxs] = useAtom(filteredCheckBoxs);
	const [, setSelectedStore] = useAtom(selectedStore);
	const router = useRouter();

	const logout = async () => {
		const clear = () => {
			setAccessTokenAtom(null);
			setStoreData('');
			setOffersData('');
			setProfileData('');
			setJoinStoresData('');
			setSalesData('');
			setDashboardData('');
			setFilteredCheckboxs({});
			setSelectedStore(0);

			localStorage.clear();
		};
		const token = JSON.parse(localStorage.getItem('access_token')!);
		try {
			const response = await axios.post(
				`${USERS_URL}/auth/jwt/logout`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.status === 200) {
				clear();
				message.success('You logged out of your account.');
				router.push('/auth/login');
			} else {
				throw new Error('Failed to logout.');
			}
		} catch (error) {
			console.error(error);
			message.error('Logout failed!');
		} finally {
			clear();
			router.push('/auth/login');
		}
	};

	return { logout };
};

export const useForgotPassword = () => {
	const { logout } = useLogout();
	const forgotPassword = async (email: string) => {
		try {
			const response = await axios.post(`${USERS_URL}/auth/forgot-password`, {
				email,
			});
			if (response.status === 202) {
				message.success('Password recovery instructions sent to your email.');
				return response.data;
			}
			throw new Error('Failed to send recovery email');
		} catch (error) {
			handleApiError(error, logout);
		}
	};

	return { forgotPassword };
};

export const useResetPassword = () => {
	const router = useRouter();
	const { logout } = useLogout();

	const resetPassword = async (
		token: string | undefined | null,
		password: string
	) => {
		try {
			const response = await axios.post(`${USERS_URL}/auth/reset-password`, {
				token,
				password,
			});
			if (response.status === 200) {
				message.success('Password reset successfully.');
				router.push('/auth/login');
			} else {
				throw new Error('Failed to reset password.');
			}
		} catch (error) {
			handleApiError(error, logout);
		}
	};

	return { resetPassword };
};
