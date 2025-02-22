import { useAtom } from 'jotai';
import { DashboardData } from '../atoms/atoms';
import { api_URL, useLogout } from './api';
import axios from 'axios';
import { handleApiError } from './handleApiError';
import { message } from 'antd';

export const useDashboard = () => {
	const { logout } = useLogout();
	let token: string | null = null;

	if (typeof window !== 'undefined') {
		token = JSON.parse(localStorage.getItem('access_token')!);
	}
	const [, setDashboardData] = useAtom(DashboardData);

	const getMyDashboard = async (
		salesLabel: string,
		returnedLabel: string,
		cancellationsLabel: string,
		chartLabel: string,
		tableLabel: string
	) => {
		try {
			const params: Record<string, string | null> = {};

			if (salesLabel?.length > 0) {
				params.sale_filter = salesLabel;
			}
			if (returnedLabel?.length > 0) {
				params.ret_filter = returnedLabel;
			}
			if (cancellationsLabel?.length > 0) {
				params.can_filter = cancellationsLabel;
			}
			if (chartLabel?.length > 0) {
				params.chart_filter = chartLabel;
			}
			if (tableLabel?.length > 0) {
				params.rec_filter = tableLabel;
			}
			const response = await axios.get(`${api_URL}/api/v1/dashboard`, {
				params,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.status === 200) {
				console.log(response.data);
				setDashboardData(response.data);
			} else {
				throw new Error('Failed to get dashboard.');
			}
		} catch (error) {
			handleApiError(error, logout);
			message.error('Failed to get dashboard.');
		}
	};

	const getSalesTable = async () => {
		try {
			const response = await axios.get(`${api_URL}/api/v1/sales`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.status === 200) {
				console.log(response.data);
			} else {
				throw new Error('Failed to get dashboard.');
			}
		} catch (error) {
			handleApiError(error, logout);
			message.error('Failed to get dashboard.');
		}
	};

	return { getMyDashboard, getSalesTable };
};
