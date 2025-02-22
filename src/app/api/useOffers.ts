import { message } from 'antd';
import axios from 'axios';
import { useAtom } from 'jotai';
import { myOffersData } from '../atoms/atoms';
import { useLogout, api_URL } from './api';
import { handleApiError } from './handleApiError';

interface editOffersI {
	id: number;
	min_price: number;
	max_price: number;
	cost_price: number;
	selling_price: number;
}

export const useOffers = () => {
	const { logout } = useLogout();
	const [, setOffersData] = useAtom(myOffersData);
	let token: string | null = null;

	if (typeof window !== 'undefined') {
		token = JSON.parse(localStorage.getItem('access_token')!);
	}

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
		filters?: Partial<Record<keyof typeof filterMapping, boolean>>
	) => {
		try {
			const params = new URLSearchParams();
			params.append('page', page.toString());
			params.append('paginate_by', '20'); // Ставим нужное количество элементов на странице

			if (filters) {
				Object.entries(filters).forEach(([key, value]) => {
					if (value && filterMapping[key as keyof typeof filterMapping]) {
						// Преобразуем ключ в нужный формат из маппинга
						const mappedKey = filterMapping[key as keyof typeof filterMapping];
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
		id,
		min_price,
		max_price,
		cost_price,
		selling_price,
	}: editOffersI) => {
		try {
			const response = await axios.post(
				`${api_URL}/api/v1/edit_offer`,
				{
					id: id,
					min_price: min_price,
					max_price: max_price,
					cost_price: cost_price,
					selling_price: selling_price,
				},
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (response.status === 200) {
				message.success('Offer updated successfully!');
			}
		} catch (error) {
			handleApiError(error, logout);
		}
	};

	const autoPriceOffers = async (id: number) => {
		try {
			const response = await axios.put(
				`${api_URL}/api/v1/toggle-autoprice/${id}`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (response.status === 200) {
				message.success('Edit offer successfuly!');
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
	const getChart = async (id: number) => {
		try {
			const response = await axios.post(
				`${api_URL}/api/v1/sales_by_week_chart/${id}`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			if (response.status === 200) {
				return response.data;
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
		getChart,
	};
};
