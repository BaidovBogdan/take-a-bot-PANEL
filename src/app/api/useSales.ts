import axios from 'axios';
import { api_URL, useLogout } from './api';
import { message } from 'antd';
import { handleApiError } from './handleApiError';
import { mySalesData } from '../atoms/atoms';
import { useAtom } from 'jotai';

export const useSales = () => {
	const { logout } = useLogout();
	const [salesData, setSalesData] = useAtom(mySalesData);
	const token = JSON.parse(localStorage.getItem('access_token')!);

	const getMySales = async (page: number, append = false) => {
		if (page === 1 && salesData.length > 0 && !append) return;
		try {
			const response = await axios.get(
				`${api_URL}/api/v1/sales?page=${page}&paginate_by=10`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (response.status === 200) {
				append
					? setSalesData((prev) => [...prev, ...response.data.recent_sales])
					: setSalesData(response.data.recent_sales);
			} else {
				throw new Error('Failed to get sales.');
			}
		} catch (error) {
			handleApiError(error, logout);
			message.error('Failed to get sales.');
		}
	};

	const updateSales = async () => {
		try {
			await axios.post(
				`${api_URL}/api/v1/update_sales`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
		} catch (error) {
			handleApiError(error, logout);
		}
	};

	const generateInvoice = async (
		order_item_id: number,
		{
			values,
		}: {
			values: {
				business_name: string;
				street: string;
				tax_number: string;
				reg_number: string;
			};
		}
	) => {
		try {
			const response = await axios.post(
				`${api_URL}/api/v1/generate_invoice/${order_item_id}`,
				{
					business_name: values.business_name,
					street: values.street,
					tax_number: values.tax_number,
					reg_number: values.reg_number,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
					responseType: 'blob',
				}
			);

			const url = window.URL.createObjectURL(new Blob([response.data]));
			const a = document.createElement('a');
			a.href = url;
			a.download = `invoice_${order_item_id}.pdf`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
			message.success('Invoice generated successfully!');
		} catch (error) {
			handleApiError(error, logout);
		}
	};

	const changeCostPrice = async (offer_id: number, cost_price: string) => {
		try {
			const response = await axios.post(
				`${api_URL}/api/v1/sales/${offer_id}`,
				{
					cost_price: cost_price,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.status === 200) {
				message.success('Cost price updated successfully!');
			}
		} catch (error) {
			handleApiError(error, logout);
		}
	};

	const wsGetSales = (page: number, paginate: number) => {
		const ws = new WebSocket('ws://34.44.207.107/api/v1/ws/sales');
		ws.onopen = () => {
			console.log('WebSocket соединение установлено');
			ws.send(
				JSON.stringify({
					action: 'auth',
					token: token,
					page: page,
					paginate_by: paginate,
				})
			);
		};
		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			const fullData = JSON.parse(data);
			if (Array.isArray(fullData.recent_sales)) {
				setSalesData(fullData.recent_sales);
			} else {
				console.error(
					'recent_sales не является массивом:',
					fullData.recent_sales
				);
			}
		};
		ws.onclose = () => {
			console.log('WebSocket connection closed');
		};
	};
	return {
		getMySales,
		updateSales,
		generateInvoice,
		wsGetSales,
		changeCostPrice,
	};
};
