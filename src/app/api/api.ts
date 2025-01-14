import axios from 'axios';

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
