'use client';

import { useEffect, useState } from 'react';
import { useOffers } from '../../api/api';
import { useAtom } from 'jotai';
import { myOffersData, OffersData, filteredCheckBoxs } from '../../atoms/atoms';
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
	Skeleton,
	Spin,
} from 'antd';
import VirtualList from 'rc-virtual-list';
import {
	ArrowDownOutlined,
	ArrowUpOutlined,
	CloseOutlined,
	ControlOutlined,
	FunnelPlotOutlined,
	RetweetOutlined,
	SearchOutlined,
} from '@ant-design/icons';

export default function MyOffers() {
	const [isUpdatedPrice, setIsUpdatedPrices] = useState(false);
	const [isUpdatedOffers, setIsUpdatedOffers] = useState(false);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const { updateOffers, getMyOffers, updatePrices } = useOffers();
	const [offers, setOffers] = useAtom(myOffersData);
	const isLoaded = !!offers.length;
	const [searchTerm, setSearchTerm] = useState('');
	const [searchField, setSearchField] = useState<'TSIN' | 'Title'>('TSIN');
	const [isSearching, setIsSearching] = useState(false);

	const [filters, setFilters] =
		useAtom<Record<string, boolean>>(filteredCheckBoxs);

	const preventDropdownClose = (e: React.MouseEvent) => {
		e.stopPropagation();
	};

	const [activeSortKey, setActiveSortKey] = useState<string>('');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'none'>('none');
	const [dropdownKey, setDropdownKey] = useState(0);

	const handleSortClick = (key: string) => {
		if (key === activeSortKey) {
			setSortOrder((prevSortOrder) =>
				prevSortOrder === 'asc'
					? 'desc'
					: prevSortOrder === 'desc'
					? 'none'
					: 'asc'
			);
		} else {
			setActiveSortKey(key);
			setSortOrder('asc');
		}
	};

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

	const handleFilterChange = (checkedValues: string[], group: string[]) => {
		setFilters((prev) => {
			const updatedFilters = { ...prev };

			// Сбрасываем фильтры только из текущей группы
			group.forEach((key) => {
				const formattedKey = key.toLowerCase().replace(/\s+/g, '');
				updatedFilters[formattedKey] = false;
			});

			// Устанавливаем true для отмеченных чекбоксов
			checkedValues.forEach((value) => {
				const key = value.toString().toLowerCase().replace(/\s+/g, '');
				updatedFilters[key] = true;
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
						getMyOffers(page, false, filters);
						setDropdownKey((prevKey) => prevKey + 1);
					}}
				>
					Apply Filters
				</Button>
			),
		},
	];

	useEffect(() => {
		setOffers([]);
		setFilters({});
		updateOffers(1);
		const timer = setTimeout(() => setLoading(false), 1000);
		return () => {
			clearTimeout(timer);
		};
	}, []);

	const handleLoadMore = (e: React.UIEvent<HTMLDivElement>) => {
		if (
			e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
			e.currentTarget.clientHeight
		) {
			setPage((prevPage) => {
				const nextPage = prevPage + 1;
				getMyOffers(nextPage, true, filters);
				return nextPage;
			});
		}
	};

	function handleEntriesChange() {
		throw new Error('Function not implemented.');
	}

	const handleSearchData = () => {
		const filteredOffers = offers.filter(
			(offer: { tsin_id: string; title: string }) =>
				searchField === 'TSIN'
					? offer.tsin_id.toLowerCase().includes(searchTerm.toLowerCase())
					: offer.title.toLowerCase().includes(searchTerm.toLowerCase())
		);
		setOffers([]);
		setTimeout(() => setOffers(filteredOffers), 100);

		setTimeout(() => {
			setIsSearching(true);
		}, 1000);
	};

	const handleResetSearch = () => {
		setSearchTerm('');
		setIsSearching(false);
		getMyOffers(1, true, filters);
	};

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
			setOffers([]);
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
		<Skeleton
			active
			title={{ width: 200 }}
			paragraph={{ rows: 10, width: '100%' }}
			loading={loading}
			className="p-4"
		>
			<div className="3xl:h-[calc(100vh-100px)] p-4 space-y-6">
				<div className="p-4 flex-col md:flex-row flex gap-5 md:justify-between">
					<div>
						<span className="font-bold text-xl text-[#012970]">My Offers</span>
						<br />
						<span className="text-xs text-gray-700 p-4">Home / My Offers</span>
					</div>
					<div className="flex gap-5 items-center">
						<Button
							type="primary"
							className="custom-btn bg-[#00215C] h-10 w-64 md:w-auto transition-colors duration-300"
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
							className="custom-btn bg-[#00215C] h-10 w-64 md:w-auto transition-colors duration-300"
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
							<Dropdown
								key={dropdownKey}
								menu={{ items: filterMenuItems }}
								trigger={['click']}
							>
								<div
									className="flex gap-4 cursor-pointer"
									onClick={() => setFilters({})}
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
							onChange={(e) => setSearchTerm(e.target.value)}
							addonBefore={
								<Select
									value={searchField}
									style={{ width: 75 }}
									onChange={(value) =>
										setSearchField(value as 'TSIN' | 'Title')
									}
								>
									<Option value="TSIN">TSIN</Option>
									<Option value="Title">Title</Option>
								</Select>
							}
						/>
						<Button
							onClick={isSearching ? handleResetSearch : handleSearchData}
						>
							{isSearching ? <CloseOutlined /> : <SearchOutlined />}
						</Button>
					</div>
					<div className="flex gap-5 justify-center bg-white shadow-md rounded-lg p-4">
						<List
							className="w-full overflow-auto scroll-smooth"
							style={{
								scrollPaddingTop: 20,
							}}
							renderItem={() => null}
						>
							<VirtualList
								data={offers}
								height={600}
								itemHeight={300}
								itemKey="id"
								onScroll={handleLoadMore}
								style={{ willChange: 'transform' }}
							>
								{(offer: OffersData) => (
									<div className="w-full test">
										<CardMyOffers key={offer.id} offer={offer} />
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
		</Skeleton>
	);
}
