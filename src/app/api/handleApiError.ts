import { message } from 'antd';
import axios from 'axios';

export const handleApiError = (error: unknown, logout: () => void) => {
	if (axios.isAxiosError(error)) {
		if (error.response?.status === 401) {
			logout();
			message.error('Session expired. Please log in again.');
		} else {
			message.error(
				error.response?.data?.message ||
					error.response?.data?.detail?.[0]?.msg ||
					error.response?.data?.detail ||
					error.response?.data?.error ||
					'An error occurred'
			);
		}
		console.error('Axios error:', error.response?.data || error.message);
	} else if (error instanceof Error) {
		message.error(error.message);
		console.error('Unexpected error:', error.message);
	} else {
		message.error('An unknown error occurred');
		console.error('Unknown error:', error);
	}
};
