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
	testAtom,
	DashboardData,
	filteredCheckBoxs,
	selectedStore,
} from '../atoms/atoms';
import { useRouter } from 'next/navigation';

interface editOffersI {
	offer_id: number;
	min_price: number;
	max_price: number;
	cost_price: number;
	selling_price: number;
}

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
	const [, setBurgerCheck] = useAtom(burgerCheckAtom);
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
			setBurgerCheck(true);
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

	const resetPassword = async (
		token: string | undefined | null,
		password: string
	) => {
		const { logout } = useLogout();
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
				useLogout();
			} else {
				throw new Error('Failed to update profile.');
			}
		} catch (error) {
			handleApiError(error, logout);
		}
	};

	return { changeProfile, getProfile, selectStore };
};

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

export const useOffers = () => {
	const { logout } = useLogout();
	const [, setOffersData] = useAtom(myOffersData);
	const token = JSON.parse(localStorage.getItem('access_token')!);

	/* prettier-ignore */
	const filterMapping = {
  "active": "active_checked",
  "bestsellers": "best_checked",
  "buyable": "buy_checked",
  "buyboxlosers": "buybox_checked",
  "disabledbyseller": "dbs_checked",
  "disabledbytakealot": "dbt_checked",
  "inactive": "inactive_checked",
  "low": "low_checked",
  "min/maxprice": "minmax_checked",
  "notbuyable": "nbuy_checked",
  "outofstock": "out_checked",
  "productcost": "cost_checked",
  "smallprofit": "profit_checked",
  "storagefee": "fee_checked",
  "sufficient": "suff_checked"
};

	const getMyOffers = async (
		page: number,
		append = false,
		filters?: Record<string, boolean>
	) => {
		try {
			const params = new URLSearchParams();
			params.append('page', page.toString());
			params.append('paginate_by', '20'); // Ставим нужное количество элементов на странице

			if (filters) {
				Object.entries(filters).forEach(([key, value]) => {
					if (value && filterMapping[key]) {
						// Преобразуем ключ в нужный формат из маппинга
						const mappedKey = filterMapping[key];
						params.append(mappedKey, 'true');
					}
				});
			}

			// Добавляем сортировку (если нужно)
			params.append('sort_param', 'default'); // или другой параметр сортировки, если нужно

			const response = await axios.get(
				`${api_URL}/api/v1/myoffers?${params.toString()}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			if (response.status === 200) {
				if (response.data.total_items <= 0) {
					message.error('No offers found.');
				}
				append
					? setOffersData((prev) => [...prev, ...response.data.data])
					: setOffersData(response.data.data);
			}
		} catch (error) {
			handleApiError(error, logout);
			message.error('Failed to get offers.');
		}
	};

	const updateOffers = async (page: number) => {
		try {
			await axios.post(
				`${api_URL}/api/v1/update_offers`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			await getMyOffers(page);
		} catch (error) {
			handleApiError(error, logout);
		}
	};

	const editOffers = async ({
		offer_id,
		min_price,
		max_price,
		cost_price,
		selling_price,
	}: editOffersI) => {
		try {
			const response = await axios.post(
				`${api_URL}/api/v1/edit_offer`,
				{
					offer_id: offer_id,
					min_price: min_price,
					max_price: max_price,
					cost_price: cost_price,
					selling_price: selling_price,
				},
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (response.status === 200) {
				// Update the specific offer in the atom
				setOffersData((prevOffers) =>
					prevOffers.map((offer) =>
						offer.offer_id === offer_id
							? { ...offer, min_price, max_price, cost_price, selling_price }
							: offer
					)
				);
				message.success('Offer updated successfully!');
			}
		} catch (error) {
			handleApiError(error, logout);
		}
	};

	const autoPriceOffers = async (offer_id: number) => {
		try {
			const response = await axios.put(
				`${api_URL}/api/v1/toggle-autoprice/${offer_id}`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (response.status === 200) {
				message.success('Edit offer successfuly!');
				setOffersData((prevOffers) =>
					prevOffers.map((offer: { offer_id: number }) =>
						offer.offer_id === offer_id
							? { ...offer, autoprice: response.data.autoprice }
							: offer
					)
				);
			}
		} catch (error) {
			handleApiError(error, logout);
		}
	};

	const updatePrices = async () => {
		try {
			const response = await axios.post(
				`${api_URL}/api/v1/upd_market_price`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			if (response.status === 200) {
				await getMyOffers(1);
				message.success('Prices updated successfully!');
			}
		} catch (error) {
			handleApiError(error, logout);
		}
	};

	return {
		updateOffers,
		getMyOffers,
		editOffers,
		autoPriceOffers,
		updatePrices,
	};
};

export const useSales = () => {
	const { logout } = useLogout();
	const [salesData, setSalesData] = useAtom(mySalesData);
	const token = JSON.parse(localStorage.getItem('access_token')!);

	const getMySales = async (page: number, append = false) => {
		if (page === 1 && salesData.length > 0 && !append) return;
		try {
			const response = await axios.get(
				`${api_URL}/api/v1/sales?page=${page}&paginate_by=30`,
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

	const updateSales = async (page: number) => {
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
			getMySales(page);
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
	return { getMySales, updateSales, generateInvoice };
};

export const useDashboard = () => {
	const { logout } = useLogout();
	const token = JSON.parse(localStorage.getItem('access_token')!);
	const [testAtomA, setTestAtomA] = useAtom(testAtom);
	const [, setDashboardData] = useAtom(DashboardData);

	const getMyDashboard = async () => {
		try {
			const response = await axios.get(`${api_URL}/api/v1/dashboard`, {
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

	const wsTest = () => {
		const ws = new WebSocket('ws://34.44.207.107/api/v1/ws/sales');
		ws.onopen = () => {
			console.log('WebSocket соединение установлено');

			// Отправляем запрос с токеном в первом сообщении
			ws.send(
				JSON.stringify({
					action: 'auth', // Первый шаг — аутентификация
					token: token,
				})
			);
		};

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			setTestAtomA(data);
			console.log('json parse:', data);
			console.log('defalut:', event.data);
			setTimeout(() => console.log(testAtomA), 3000);
		};
		ws.onclose = () => {
			console.log('WebSocket connection closed');
		};
	};

	return { getMyDashboard, wsTest };
};

const handleApiError = (error: unknown, logout: () => void) => {
	if (axios.isAxiosError(error)) {
		if (error.response?.status === 401) {
			logout();
			message.error('Session expired. Please log in again.');
		} else {
			message.error(
				error.response?.data?.message ||
					error.response?.data?.detail?.[0]?.msg ||
					error.response?.data?.detail ||
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
