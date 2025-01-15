import { message } from 'antd';
import { useAtom } from 'jotai';
import { accessTokenAtom } from '../atoms/atoms';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export const BASE_URL = 'http://35.232.222.207';

export const requestVerifyToken = async ({ email }: { email: string }) => {
	try {
		const response = await axios.post(`${BASE_URL}/auth/request-verify-token`, {
			email,
		});

		if (response.status === 202) {
			console.log(
				'Token verification request sent successfully:',
				response.data
			);
			message.success('Verification email has been sent!');
			return response.data;
		} else {
			console.error('Unexpected response status:', response.status);
			throw new Error('Failed to send verification request');
		}
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			console.error('Axios error:', error.response?.data || error.message);
			throw new Error(
				error.response?.data?.message || 'Failed to verify token'
			);
		} else if (error instanceof Error) {
			console.error('Unexpected error:', error.message);
			throw new Error('An unexpected error occurred');
		} else {
			console.error('Unknown error:', error);
			throw new Error('An unknown error occurred');
		}
	}
};

export const useLogout = () => {
	const [, setAccessTokenAtom] = useAtom(accessTokenAtom);

	const logout = async (token: string | undefined | null) => {
		try {
			const response = await axios.post(`${BASE_URL}/auth/jwt/logout`, {
				token,
			});
			if (response.status !== 200) {
				console.error('Unexpected response status:', response.status);
				throw new Error('Failed to logout.');
			}
			console.log('You logged out of your account.');
			setAccessTokenAtom('');
			message.success('You logged out of your account.');
		} catch (error: unknown) {
			if (axios.isAxiosError(error)) {
				if (error.response?.status === 401) {
					setAccessTokenAtom('');
					message.error('Session expired. Please log in again.');
					console.error(
						'Session expired:',
						error.response?.data || error.message
					);
				} else {
					message.error(error.response?.data.detail || 'An error occurred.');
					console.error('Axios error:', error.response?.data || error.message);
					throw new Error(
						error.response?.data?.message ||
							'Failed to logout due to server error.'
					);
				}
			} else if (error instanceof Error) {
				console.error('Unexpected error:', error.message);
				throw new Error('An unexpected error occurred during logout.');
			} else {
				console.error('Unknown error:', error);
				throw new Error('An unknown error occurred during logout.');
			}
		}
	};

	return { logout };
};

export const forgotPassword = async ({ email }: { email: string }) => {
	try {
		const response = await axios.post(`${BASE_URL}/auth/forgot-password`, {
			email,
		});

		if (response.status === 202) {
			console.log('Forgot password request sent successfully:', response.data);
			return response.data;
		} else {
			console.error('Unexpected response status:', response.status);
			throw new Error('Failed to send verification request');
		}
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			console.error('Axios error:', error.response?.data || error.message);
			throw new Error(
				error.response?.data?.message || 'Failed to verify token'
			);
		} else if (error instanceof Error) {
			console.error('Unexpected error:', error.message);
			throw new Error('An unexpected error occurred');
		} else {
			console.error('Unknown error:', error);
			throw new Error('An unknown error occurred');
		}
	}
};

export const resetPassword = async ({
	token,
	password,
}: {
	token: string | undefined | null;
	password: string;
}) => {
	const router = useRouter();
	try {
		const response = await axios.post(`${BASE_URL}/auth/reset-password`, {
			token,
			password,
		});

		if (response.status === 200) {
			console.log('Password reset successfully.');
			message.success('Password reset successfully.');
			router.push('/auth/login');
		} else {
			console.error('Unexpected response status:', response.status);
			throw new Error('Failed to reset password.');
		}
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			console.error('Axios error:', error.response?.data || error.message);
			message.error(error.response?.data.detail);
			throw new Error(
				error.response?.data?.message ||
					'Failed to reset password due to server error.'
			);
		} else if (error instanceof Error) {
			console.error('Unexpected error:', error.message);
			throw new Error('An unexpected error occurred during password reset.');
		} else {
			console.error('Unknown error:', error);
			throw new Error('An unknown error occurred during password reset.');
		}
	}
};
