'use client';

import {
	Table,
	Tag,
	Pagination,
	Select,
	Dropdown,
	Input,
	Skeleton,
} from 'antd';
import { ReactNode, useState } from 'react';

interface SaleRecord {
	formatted_order_date: string | number | Date;
	selling_price: any;
	net_profit: any;
	sale_status: string;
	product_title: string;
	id: string | number;
	quantity: number;
	dc: string;
}

interface RecentSalesProps {
	data: SaleRecord[];
	handleTableFilter: (filter: string) => void;
	tableFilter: string;
	label: string;
}

type MenuItem =
	| { key: string; label: string; type?: undefined; onClick?: () => void }
	| { type: 'divider'; key?: undefined; label?: undefined };

export const RecentSales = ({
	data,
	handleTableFilter,
	tableFilter,
	label,
}: RecentSalesProps) => {
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [entriesPerPage, setEntriesPerPage] = useState<string | number>(10);
	const [searchText, setSearchText] = useState<string>('');
	const startIndex = (currentPage - 1) * Number(entriesPerPage);

	const handleFilterClick = (filter: string) => {
		handleTableFilter(filter);
	};

	const menuItems: MenuItem[] = [
		{ key: 'today', label: 'Today', onClick: () => handleFilterClick('today') },
		{
			key: 'thisWeek',
			label: 'This Week',
			onClick: () => handleFilterClick('this-week'),
		},
		{
			key: 'thisMonth',
			label: 'This Month',
			onClick: () => handleFilterClick('this-month'),
		},
		{
			key: 'thisYear',
			label: 'This Year',
			onClick: () => handleFilterClick('this-year'),
		},
		{ type: 'divider' },
		{
			key: 'last7Days',
			label: 'Last 7 Days',
			onClick: () => handleFilterClick('last-7-days'),
		},
		{
			key: 'last90Days',
			label: 'Last 90 Days',
			onClick: () => handleFilterClick('last-90-days'),
		},
		{ key: 'all', label: 'All', onClick: () => handleFilterClick('all') },
		{ type: 'divider' },
	];

	// Filter data based on search
	const filteredData = data.filter((record) =>
		Object.values(record).some((value) =>
			value.toString().toLowerCase().includes(searchText.toLowerCase())
		)
	);

	// Slice the filtered data for pagination
	const paginatedData =
		entriesPerPage === 'all'
			? filteredData
			: filteredData.slice(startIndex, startIndex + Number(entriesPerPage));

	const columns = [
		{
			title: 'Date',
			dataIndex: 'formatted_order_date',
			key: 'formatted_order_date',
			sorter: (a: SaleRecord, b: SaleRecord) =>
				new Date(a.formatted_order_date).getTime() -
				new Date(b.formatted_order_date).getTime(),
			render: (date: ReactNode) => <b>{date}</b>,
		},
		{
			title: 'Product',
			dataIndex: 'product_title',
			key: 'product_title',
			sorter: (a: SaleRecord, b: SaleRecord) =>
				(a.product_title || '').localeCompare(b.product_title || ''),
			render: (product: string) => (
				<span
					className="hover:underline hover:cursor-pointer"
					style={{ color: '#4154f1' }}
				>
					{product}
				</span>
			),
		},
		{
			title: 'Qty',
			dataIndex: 'quantity',
			key: 'quantity',
			align: 'center',
			sorter: (a: SaleRecord, b: SaleRecord) => a.quantity - b.quantity,
			render: (quantity: number) => (
				<Tag className="p-2 w-12 text-center text-base hover:bg-gray-500 hover:text-white">
					{quantity}
				</Tag>
			),
		},
		{
			title: 'Status',
			dataIndex: 'sale_status',
			key: 'sale_status',
			sorter: (a: SaleRecord, b: SaleRecord) =>
				(a.sale_status || '').localeCompare(b.sale_status || ''),
			render: (status: string) => {
				const color =
					status === 'Shipped'
						? 'green'
						: status === 'Returned'
						? 'red'
						: 'blue';
				return <Tag color={color}>{status}</Tag>;
			},
		},
		{
			title: 'DC',
			dataIndex: 'dc',
			key: 'dc',
			sorter: (a: SaleRecord, b: SaleRecord) => a.dc.localeCompare(b.dc),
			render: (dc: string) => (
				<Tag className="p-2 w-16 text-base text-center hover:bg-gray-500 hover:text-white">
					{dc}
				</Tag>
			),
		},
		{
			title: 'Price',
			dataIndex: 'selling_price',
			key: 'selling_price',
			sorter: (a: SaleRecord, b: SaleRecord) =>
				a.selling_price - b.selling_price,
			render: (price: number) => (
				<Tag className="p-2 w-16 text-center text-base hover:bg-gray-500 hover:text-white">
					{price}
				</Tag>
			),
		},
		{
			title: 'Profit',
			dataIndex: 'net_profit',
			key: 'net_profit',
			sorter: (a: SaleRecord, b: SaleRecord) => a.net_profit - b.net_profit,
		},
	];

	const handlePageChange = (page: number) => setCurrentPage(page);
	const handleEntriesChange = (value: string | number) => {
		setEntriesPerPage(value === 'all' ? 'all' : Number(value));
		setCurrentPage(1);
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchText(e.target.value);
		setCurrentPage(1);
	};

	return (
		<div className="bg-white shadow-md rounded-lg p-4">
			<div className="flex justify-between">
				<span className="text-[#899bbd] text-sm">
					<b className="text-xl text-[#012970] ">Recent Sales </b>|{' '}
					{label && label !== null ? (
						label
					) : (
						<Skeleton.Input active size="small" />
					)}
				</span>
				<Dropdown
					menu={{ items: menuItems }}
					placement="bottomRight"
					trigger={['click']}
					arrow
				>
					<button className="text-[#7D879C] text-sm hover:text-gray-800">
						•••
					</button>
				</Dropdown>
			</div>
			<div className="flex gap-2 flex-col md:flex-row md:gap-0 md:justify-between items-center p-2 mb-4">
				<div>
					<span className="text-gray-800 mr-2">Entries per page:</span>
					<Select
						defaultValue="10"
						style={{ width: 120 }}
						onChange={handleEntriesChange}
						options={[
							{ value: '5', label: '5' },
							{ value: '10', label: '10' },
							{ value: '15', label: '15' },
							{ value: '40', label: '40' },
						]}
					/>
				</div>
				<Input
					placeholder="Search"
					style={{ width: 200 }}
					value={searchText}
					onChange={handleSearchChange}
				/>
				<span className="text-gray-600">
					Showing {paginatedData.length} of {filteredData.length} entries
				</span>
			</div>
			<Table
				className="overflow-x-auto 2xl:overflow-x-hidden"
				//@ts-expect-error
				columns={columns}
				dataSource={paginatedData}
				pagination={false}
				rowKey={(record) => record.id.toString()}
				rowClassName={(record, index) =>
					index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
				}
			/>
			{entriesPerPage !== 'all' && (
				<div className="flex justify-end mt-4">
					<Pagination
						current={currentPage}
						total={filteredData.length}
						pageSize={Number(entriesPerPage)}
						onChange={handlePageChange}
					/>
				</div>
			)}
		</div>
	);
};
