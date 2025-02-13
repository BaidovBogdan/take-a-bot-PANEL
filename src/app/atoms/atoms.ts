import { atomWithStorage } from 'jotai/utils';

interface Company {
	company_name: string;
	api_key: string;
	sellers_id: string;
	street: string;
	city: string;
	postal_code: string;
	id: number;
	created_at: string;
	updated_at: string;
	users: any;
	owner_id: number;
}

interface User {
	id: number;
	email: string;
	is_active: true;
	is_superuser: false;
	is_verified: false;
	username: string;
}

export interface OffersData {
	id: number;
	offer_id: number;
	store_id: number;
	title: string;
	image_url: string;
	offer_url: string;
	sku: string;
	barcode: string;
	product_label_number: string;
	tsin_id: string;
	status: string;
	autoprice: boolean;
	best_price: boolean;
	competitors: number;
	cost_price: number | null;
	min_price: number | null;
	max_price: number | null;
	takealot_price: number;
	selling_price: number;
	rrp: number;
	discount: string;
	discount_shown: boolean;
	net_profit: number | null;
	total_sales_units: number | null;
	total_profit: number | null;
	stock_at_takealot_total: number;
	leadtime_days: number | null;
	storage_fee_eligible: boolean;
	notification_status: boolean;
	notification_message: string | null;
	notification_timestamp: string | null;
	created_at: string;
	updated_at: string | null;
	date_created: string;
}

interface Store {
	id: number;
	company_name: string;
}

interface User {
	id: number;
	username: string;
}

interface JoinStores {
	owner: boolean;
	id: number;
	store_id: number;
	user_id: number;
	status: string;
	store: Store;
	user: User;
}

export interface SalesData {
	sku: string;
	takealot_url: string;
	order_item_id: number;
	id: number;
	product_title: string;
	success_fee: number;
	myoffer_id: number;
	sale_status: string;
	takealot_url_mobi: string;
	fulfillment_fee: number;
	updated_at: string | null;
	order_id: number;
	selling_price: number;
	courier_collection_fee: number;
	net_profit: number;
	order_date: string;
	quantity: number;
	auto_ibt_fee: number;
	decimal: number;
	created_at: string;
	dc: string;
	total_fee: number;
	offer_id: number;
	customer: string;
	stock_transfer_fee: number;
	tsin: string;
	store_id: number;
	formatted_order_date: string;
}

export interface Dashboard {
	all_cost_prices: boolean;
	average_sale_amount: string;
	can_filter_label: string;
	cancelations_amount: string;
	cancelations_percentage: number;
	cancelations_total: number;
	cancelations_total_fee_sum: string;
	cancelations_units: number;
	cost_price_percentage: number;
	danger_statuses: string[];
	fee_percentage: number;
	pure_profit_percentage: number;
	rec_filter_label: string;
	recent_sales: any[];
	ret_filter_label: string;
	return_amount: string;
	return_percentage: number;
	return_total: number;
	return_total_fee_sum: string;
	return_units: number;
	sale_filter_label: string;
	sales_amount: string;
	sales_percentage: number;
	sales_total: number;
	sales_units: number;
	top_filter_label: string;
	top_sales: TopSale[];
	total_cost_price: number;
	total_fee: number;
	total_pure_profit: number;
	warning_statuses: string[];
}

interface TopSale {
	offer_id: number;
	product_title: string;
	image_url: string;
	price: string;
	total_money: string;
	total_quantity: number;
}

export const myStoreData = atomWithStorage<Company[] | ''>('my_store_data', []);
export const myProfileData = atomWithStorage<User[] | ''>(
	'my_profile_data',
	[]
);
export const myOffersData = atomWithStorage<OffersData[] | ''>(
	'my_offers_data',
	[]
);

export const joinStoresData = atomWithStorage<JoinStores[] | ''>(
	'join_stores_data',
	[]
);
export const mySalesData = atomWithStorage<SalesData[] | ''>(
	'my_sales_data',
	[]
);

export const filteredCheckBoxs = atomWithStorage<Record<string, boolean>>(
	'filteredCheckBoxs',
	{}
);

export const DashboardData = atomWithStorage<Dashboard | ''>(
	'dashboard_data',
	''
);

export const selectedStore = atomWithStorage<number>('selected_store', 0);

export const testAtom = atomWithStorage('test', {});

export const accessTokenAtom = atomWithStorage<
	string | null | undefined | any | ''
>('access_token', null);
export const burgerCheckAtom = atomWithStorage<boolean>('burger', true);
