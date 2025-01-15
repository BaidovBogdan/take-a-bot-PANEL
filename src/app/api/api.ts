import { useAtom } from 'jotai';
import { message } from 'antd';
import axios from 'axios';
import { accessTokenAtom } from '../atoms/atoms';
import { useRouter } from 'next/navigation';

export const BASE_URL = 'http://35.232.222.207';

export const useRequestVerifyToken = () => {
	const requestVerifyToken = async (email: string) => {
		try {
			const response = await axios.post(
				`${BASE_URL}/auth/request-verify-token`,
				{ email }
			);
			if (response.status === 202) {
				message.success('Verification email has been sent!');
				return response.data;
			}
			throw new Error('Failed to send verification request');
		} catch (error) {
			handleApiError(error);
		}
	};

	return { requestVerifyToken };
};

export const useLogout = () => {
	const [, setAccessTokenAtom] = useAtom(accessTokenAtom);
	const router = useRouter();

	const logout = async (token: string | undefined | null) => {
		try {
			const response = await axios.post(`${BASE_URL}/auth/jwt/logout`, {
				token,
			});
			if (response.status === 200) {
				setAccessTokenAtom('');
				message.success('You logged out of your account.');
				router.push('/auth/login');
			} else {
				throw new Error('Failed to logout.');
			}
		} catch (error) {
			handleApiError(error);
		}
	};

	return { logout };
};

export const useForgotPassword = () => {
	const forgotPassword = async (email: string) => {
		try {
			const response = await axios.post(`${BASE_URL}/auth/forgot-password`, {
				email,
			});
			if (response.status === 202) {
				message.success('Password recovery instructions sent to your email.');
				return response.data;
			}
			throw new Error('Failed to send recovery email');
		} catch (error) {
			handleApiError(error);
		}
	};

	return { forgotPassword };
};

export const useResetPassword = () => {
	const router = useRouter();

	const resetPassword = async (
		token: string | undefined | null,
		password: string
	) => {
		try {
			const response = await axios.post(`${BASE_URL}/auth/reset-password`, {
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
			handleApiError(error);
		}
	};

	return { resetPassword };
};

const handleApiError = (error: unknown) => {
	if (axios.isAxiosError(error)) {
		message.error(error.response?.data?.message || 'An error occurred');
		console.error('Axios error:', error.response?.data || error.message);
	} else if (error instanceof Error) {
		message.error(error.message);
		console.error('Unexpected error:', error.message);
	} else {
		message.error('An unknown error occurred');
		console.error('Unknown error:', error);
	}
};
