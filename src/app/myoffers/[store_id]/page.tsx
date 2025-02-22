'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useOffers } from '../../api/useOffers';
import { useAtom } from 'jotai';
import { myOffersData, OffersData, selectedStore } from '../../atoms/atoms';
import { CardMyOffers } from '../../components/myoffers/CardMyOffers';
import {
	Button,
	Checkbox,
	Dropdown,
	Input,
	List,
	MenuProps,
	message,
	Select,
	Spin,
} from 'antd';
import VirtualList from 'rc-virtual-list';
import {
	ArrowDownOutlined,
	ArrowUpOutlined,
	ControlOutlined,
	FunnelPlotOutlined,
	HomeOutlined,
	RetweetOutlined,
} from '@ant-design/icons';
import debounce from 'lodash.debounce';
import { useRouter, usePathname } from 'next/navigation';

export default function MyOffers() {
	const [isUpdatedPrice, setIsUpdatedPrices] = useState(false);
	const [isUpdatedOffers, setIsUpdatedOffers] = useState(false);
	const [page, setPage] = useState(1);
	const { updateOffers, getMyOffers, updatePrices } = useOffers();
	const [offers, setOffers] = useAtom(myOffersData);
	const isLoaded = offers && Object.keys(offers).length > 0;
	const [searchTerm, setSearchTerm] = useState<string | number>('');
	const [searchField, setSearchField] = useState<'TSIN' | 'Title'>('TSIN');
	const [filters, setFilters] = useState<Record<string, boolean>>({});
	const [activeSortKey, setActiveSortKey] = useState<string>('Sales - Revenue');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'none'>('asc');
	let token: string | null = null;
	let wsUrl: string | undefined = '';

	if (typeof window !== 'undefined') {
		token = JSON.parse(localStorage.getItem('access_token')!);
		wsUrl = process.env.NEXT_PUBLIC_API_URL;
	}
	const [selectedStoreId] = useAtom(selectedStore);
	const wsRef = useRef<WebSocket | null>(null);
	const router = useRouter();
	const pathname = usePathname();
	const storeId = pathname.split('/').pop();
	const prevResultRef = useRef(null);
	const [sort, setSort] = useState('');

	useEffect(() => {
		if (!storeId || !selectedStoreId) return;

		if (+storeId !== +selectedStoreId) {
			router.replace(`/myoffers/${selectedStoreId}`);
		}
	}, [selectedStoreId, storeId, router]);

	const wsGetOffers = debounce(
		(
			page: number,
			filters?: Record<string, boolean>,
			search?: string,
			sort?: string
		) => {
			if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
				const sortParam = (() => {
					if (sortOrder === 'none' || !activeSortKey) return '';

					const mapping: Record<string, string> = {
						'Sales - Unit': 'sales_unit',
						'Sales - Revenue': 'sales_revenue',
						'Total Profit': 'profit',
						'Product Title': 'title',
						'Selling Price': 'selling_price',
						'Stock at Takealot': 'stock',
					};

					const direction = sortOrder === 'asc' ? 'up' : 'down';
					return `${mapping[activeSortKey]}_${direction}`;
				})();

				const payload: Record<string, any> = {
					action: 'auth',
					token: token,
					page: page,
					paginate_by: 10,
					...filters,
				};

				if (search && search.trim() !== '') {
					payload.search = isNaN(+search) ? search : +search;
				}
				if (sortParam) {
					payload.sort_param = sortParam;
				}

				wsRef.current.send(JSON.stringify(payload));
			}
		},
		1000, // Задержка в 1 секунду
		{ leading: true, trailing: false } // Позволяет отправлять только одно сообщение в секунду
	);

	useEffect(() => {
		const sortParam = (() => {
			if (sortOrder === 'none' || !activeSortKey) return '';

			const mapping: Record<string, string> = {
				'Sales - Unit': 'sales_unit',
				'Sales - Revenue': 'sales_revenue',
				'Total Profit': 'profit',
				'Product Title': 'title',
				'Selling Price': 'selling_price',
				'Stock at Takealot': 'stock',
			};

			const direction = sortOrder === 'asc' ? 'up' : 'down';
			return `${mapping[activeSortKey]}_${direction}`;
		})();
		setSort(sortParam);
	}, [activeSortKey, sortOrder]);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		if (wsRef.current) {
			console.log('Закрываем старый WebSocket перед созданием нового');
			wsRef.current.close();
		}

		setOffers([]);
		wsRef.current = new WebSocket(`ws://${wsUrl}/api/v1/ws/myoffers`);

		wsRef.current.onopen = () => {
			console.log('WebSocket соединение установлено');
			wsGetOffers(page);
		};
		wsRef.current.onmessage = (event) => {
			const data = JSON.parse(event.data);
			const finalData = JSON.parse(data);
			const result = finalData.data;

			if (JSON.stringify(result) !== JSON.stringify(prevResultRef.current)) {
				setOffers((prev) => [...prev, ...result]);
				prevResultRef.current = result;
			} else {
				console.log('Received duplicate result, ignoring');
			}
			result.length < 1 ? message.error('Offers not found') : null;
		};

		wsRef.current.onerror = (error) => {
			console.error('WebSocket ошибка:', error);
		};

		wsRef.current.onclose = () => {
			console.log('WebSocket соединение закрыто');
		};

		return () => {
			if (wsRef.current) {
				wsRef.current.close();
			}
		};
	}, []);

	const handleApplyFilters = () => {
		console.log('Применены фильтры:', filters);
		setOffers([]); //@ts-ignore
		wsGetOffers(1, filters, searchTerm, sort);
		setPage(1);
	};

	const debouncedSearch = useCallback(
		debounce((value: string, currentFilters: Record<string, boolean>) => {
			setPage(1);
			setOffers([]);
			wsGetOffers(1, currentFilters, value, sort);
		}, 1000),
		[filters, sort]
	);

	const handleNewCard = () => {
		//@ts-ignore
		wsGetOffers(page, filters, searchTerm);
	};

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchTerm(value);
		debouncedSearch(value, filters);
	};

	const handleLoadMore = (e: React.UIEvent<HTMLDivElement>) => {
		if (
			e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
			e.currentTarget.clientHeight
		) {
			setPage((prevPage) => {
				const nextPage = prevPage + 1; //@ts-ignore
				wsGetOffers(nextPage, filters, searchTerm, sort);
				return nextPage;
			});
		}
	};

	const handleSortClick = (key: string) => {
		if (key === activeSortKey) {
			setSortOrder((prev) => {
				if (prev === 'asc') return 'desc';
				if (prev === 'desc') return 'none';
				return 'asc';
			});
		} else {
			setActiveSortKey(key);
			setSortOrder('asc');
		}
		setPage(1);
	};

	const preventDropdownClose = (e: React.MouseEvent) => {
		e.stopPropagation();
	};

	useEffect(() => {
		if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
			setOffers([]); //@ts-ignore
			wsGetOffers(page, filters, searchTerm, sort);
		}

		console.log('activeSortKey:', activeSortKey, 'sortOrder:', sortOrder);
	}, [activeSortKey, sortOrder]);

	/* prettier-ignore */
	const filterMapping: Record<string, string> = {
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

	const handleFilterChange = (checkedValues: string[], group: string[]) => {
		setFilters((prev) => {
			const updatedFilters = { ...prev };

			group.forEach((filter) => {
				const key = filter.toString().toLowerCase().replace(/\s+/g, '');
				const mappedKey = filterMapping[key as keyof typeof filterMapping];

				if (mappedKey && !checkedValues.includes(filter)) {
					delete updatedFilters[mappedKey];
				}
			});

			checkedValues.forEach((value) => {
				const key = value.toString().toLowerCase().replace(/\s+/g, '');
				const mappedKey = filterMapping[key];

				if (mappedKey) {
					updatedFilters[mappedKey] = true;
				}
			});

			return updatedFilters;
		});
	};

	const filterMenuItems: MenuProps['items'] = [
		{
			key: 'filters',
			type: 'group',
			label: 'FILTERS',
			children: [
				{
					key: 'filters-1',
					label: (
						<div className="mb-2" onClick={preventDropdownClose}>
							<Checkbox.Group
								onChange={(checkedValues) =>
									handleFilterChange(checkedValues, [
										'BuyBox losers',
										'Storage fee',
									])
								}
								options={['BuyBox losers', 'Storage fee']}
							/>
						</div>
					),
				},
				{
					key: 'filters-2',
					label: (
						<div className="mb-2" onClick={preventDropdownClose}>
							<Checkbox.Group
								onChange={(checkedValues) =>
									handleFilterChange(checkedValues, [
										'Small profit',
										'Bestsellers',
									])
								}
								options={['Small profit', 'Bestsellers']}
							/>
						</div>
					),
				},
			],
		},
		{
			key: 'status',
			type: 'group',
			label: 'STATUS',
			children: [
				{
					key: 'status-1',
					label: (
						<div className="mb-2" onClick={preventDropdownClose}>
							<Checkbox.Group
								onChange={(checkedValues) =>
									handleFilterChange(checkedValues, [
										'Buyable',
										'Disabled by Takealot',
									])
								}
								options={['Buyable', 'Disabled by Takealot']}
							/>
						</div>
					),
				},
				{
					key: 'status-2',
					label: (
						<div className="mb-2" onClick={preventDropdownClose}>
							<Checkbox.Group
								onChange={(checkedValues) =>
									handleFilterChange(checkedValues, [
										'Not Buyable',
										'Disabled by Seller',
									])
								}
								options={['Not Buyable', 'Disabled by Seller']}
							/>
						</div>
					),
				},
			],
		},
		{
			key: 'autoprice',
			type: 'group',
			label: 'AUTOPRICE STATUS',
			children: [
				{
					key: 'autoprice-1',
					label: (
						<div className="mb-4" onClick={preventDropdownClose}>
							<Checkbox.Group
								onChange={(checkedValues) =>
									handleFilterChange(checkedValues, ['Active', 'Inactive'])
								}
								options={['Active', 'Inactive']}
							/>
						</div>
					),
				},
			],
		},
		{
			key: 'stock',
			type: 'group',
			label: 'STOCK',
			children: [
				{
					key: 'stock-1',
					label: (
						<div className="mb-4" onClick={preventDropdownClose}>
							<Checkbox.Group
								onChange={(checkedValues) =>
									handleFilterChange(checkedValues, [
										'Sufficient',
										'Low',
										'Out of stock',
									])
								}
								options={['Sufficient', 'Low', 'Out of stock']}
							/>
						</div>
					),
				},
			],
		},
		{
			key: 'settings',
			type: 'group',
			label: 'SETTINGS',
			children: [
				{
					key: 'settings-1',
					label: (
						<div className="mb-4" onClick={preventDropdownClose}>
							<Checkbox.Group
								onChange={(checkedValues) =>
									handleFilterChange(checkedValues, [
										'Min/Max price',
										'Product cost',
									])
								}
								options={['Min/Max price', 'Product cost']}
							/>
						</div>
					),
				},
			],
		},
		{
			key: 'apply',
			label: (
				<Button
					type="primary"
					className="w-full"
					onClick={() => {
						console.log('Filters applied:', filters);
						handleApplyFilters();
					}}
				>
					Apply Filters
				</Button>
			),
		},
	];
	const sortMenuItems = [
		{
			key: 'Sales - Unit',
			label: (
				<div
					onClick={(e) => {
						e.stopPropagation();
						handleSortClick('Sales - Unit');
					}}
					className="flex justify-between items-center w-48"
				>
					<span>Sales - Unit</span>
					{activeSortKey === 'Sales - Unit' &&
						sortOrder !== 'none' &&
						(sortOrder === 'asc' ? <ArrowUpOutlined /> : <ArrowDownOutlined />)}
				</div>
			),
		},
		{
			key: 'Sales - Revenue',
			label: (
				<div
					onClick={(e) => {
						e.stopPropagation();
						handleSortClick('Sales - Revenue');
					}}
					className="flex justify-between items-center w-48"
				>
					<span>Sales - Revenue</span>
					{activeSortKey === 'Sales - Revenue' &&
						sortOrder !== 'none' &&
						(sortOrder === 'asc' ? <ArrowUpOutlined /> : <ArrowDownOutlined />)}
				</div>
			),
		},
		{
			key: 'Total Profit',
			label: (
				<div
					onClick={(e) => {
						e.stopPropagation();
						handleSortClick('Total Profit');
					}}
					className="flex justify-between items-center w-48"
				>
					<span>Total Profit</span>
					{activeSortKey === 'Total Profit' &&
						sortOrder !== 'none' &&
						(sortOrder === 'asc' ? <ArrowUpOutlined /> : <ArrowDownOutlined />)}
				</div>
			),
		},
		{
			key: 'Product Title',
			label: (
				<div
					onClick={(e) => {
						e.stopPropagation();
						handleSortClick('Product Title');
					}}
					className="flex justify-between items-center w-48"
				>
					<span>Product Title</span>
					{activeSortKey === 'Product Title' &&
						sortOrder !== 'none' &&
						(sortOrder === 'asc' ? <ArrowUpOutlined /> : <ArrowDownOutlined />)}
				</div>
			),
		},
		{
			key: 'Selling Price',
			label: (
				<div
					onClick={(e) => {
						e.stopPropagation();
						handleSortClick('Selling Price');
					}}
					className="flex justify-between items-center w-48"
				>
					<span>Selling Price</span>
					{activeSortKey === 'Selling Price' &&
						sortOrder !== 'none' &&
						(sortOrder === 'asc' ? <ArrowUpOutlined /> : <ArrowDownOutlined />)}
				</div>
			),
		},
		{
			key: 'Stock at Takealot',
			label: (
				<div
					onClick={(e) => {
						e.stopPropagation();
						handleSortClick('Stock at Takealot');
					}}
					className="flex justify-between items-center w-48"
				>
					<span>Stock at Takealot</span>
					{activeSortKey === 'Stock at Takealot' &&
						sortOrder !== 'none' &&
						(sortOrder === 'asc' ? <ArrowUpOutlined /> : <ArrowDownOutlined />)}
				</div>
			),
		},
	];

	function handleEntriesChange() {
		throw new Error('Function not implemented.');
	}

	const { Option } = Select;

	const handleUpdatePrices = async () => {
		setIsUpdatedPrices(true);
		try {
			await updatePrices();
		} catch (error) {
			console.error('Ошибка обновления цен:', error);
		} finally {
			setIsUpdatedPrices(false);
		}
	};

	const handleUpdateOffers = async () => {
		setIsUpdatedOffers(true);
		try {
			await updateOffers(1);
		} catch (error) {
			console.error('Ошибка обновления цен:', error);
		} finally {
			setIsUpdatedOffers(false);
			getMyOffers(1, true, filters);
			message.success('Offers updated successfully');
		}
	};

	return (
		<div className="3xl:h-[calc(100vh-100px)] p-4 space-y-6">
			<div className="p-4 flex-col md:flex-row flex gap-5 md:justify-between">
				<div>
					<span className="font-bold text-xl text-[#012970]">My Offers</span>
					<br />
					<div className="text-xs text-gray-700 p-4 flex gap-1">
						<div className="flex items-center">
							<HomeOutlined />
						</div>{' '}
						<span>/ My Offers</span>
					</div>
				</div>
				<div className="flex gap-5 items-center">
					<Button
						type="primary"
						className={`custom-btn bg-[#00215C] h-10 w-64 md:w-auto transition-colors duration-300 ${
							isUpdatedPrice ? 'loading' : ''
						}`}
						icon={<RetweetOutlined />}
						iconPosition="start"
						onClick={() => handleUpdatePrices()}
						loading={isUpdatedPrice}
						block
					>
						Prices
					</Button>

					<Button
						type="primary"
						className={`custom-btn bg-[#00215C] h-10 w-64 md:w-auto transition-colors duration-300 ${
							isUpdatedOffers ? 'loading' : ''
						}`}
						icon={<RetweetOutlined />}
						iconPosition="start"
						onClick={() => handleUpdateOffers()}
						loading={isUpdatedOffers}
						block
					>
						Offers
					</Button>
				</div>
			</div>
			<div className="bg-white rounded-lg shadow-md">
				<div className="flex flex-col gap-2 md:flex-row md:justify-end items-center p-4">
					<div className="flex gap-7 mr-9 text-[#012970] font-bold">
						<Dropdown menu={{ items: sortMenuItems }} trigger={['click']}>
							<div className="flex gap-4 cursor-pointer">
								Sort <ControlOutlined />
							</div>
						</Dropdown>
						<span>|</span>
						<Dropdown menu={{ items: filterMenuItems }} trigger={['click']}>
							<div
								className="flex gap-4 cursor-pointer"
								onClick={() => setPage(1)}
							>
								Filter <FunnelPlotOutlined />
							</div>
						</Dropdown>
					</div>
				</div>
				<div className="flex justify-center pb-5">
					<Input
						placeholder="Search"
						className="w-64"
						value={searchTerm}
						onChange={handleSearch}
						addonBefore={
							<Select
								value={searchField}
								style={{ width: 75 }}
								onChange={(value) => setSearchField(value as 'TSIN' | 'Title')}
							>
								<Option value="TSIN">TSIN</Option>
								<Option value="Title">Title</Option>
							</Select>
						}
					/>
				</div>
				<div className="flex gap-5 justify-center bg-white shadow-md rounded-lg p-4">
					<List
						className="w-full overflow-auto scroll-smooth"
						renderItem={() => null}
					>
						<VirtualList
							//@ts-ignore
							data={offers}
							height={600}
							itemHeight={300}
							itemKey="id"
							onScroll={handleLoadMore}
							style={{ willChange: 'transform' }}
						>
							{(offer: OffersData) => (
								<div className="w-full test">
									<CardMyOffers
										key={offer.id}
										offer={offer}
										newCard={handleNewCard}
									/>
								</div>
							)}
						</VirtualList>
					</List>
					{!isLoaded && (
						<div className="absolute">
							<Spin />
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
