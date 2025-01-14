'use client';

import {
	Table,
	Tag,
	Pagination,
	Select,
	Dropdown,
	Input,
	Button,
	Skeleton,
} from 'antd';
import { CopyOutlined, DownOutlined, UndoOutlined } from '@ant-design/icons';
import { SetStateAction, useEffect, useState } from 'react';
import { FilterMenuMySales } from '../components/mysales/MySalesFilterDropDown';

interface SaleData {
	id: string;
	date: string;
	title: string;
	quantity: number;
	status: string;
	dc: string;
	price: number;
	fee: number;
	cost: number;
	profit: number;
	customer: string;
}

export default function MySales() {
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [entriesPerPage, setEntriesPerPage] = useState<number | 'all'>(10);
	const [searchText, setSearchText] = useState<string>('');

	const data: SaleData[] = [
		{
			id: '0',
			date: '02.01 20:08',
			title: 'Silicone Shampoo Brush/ Scalp Massage (Purple)',
			quantity: 1,
			status: 'DC Transfer',
			dc: 'JHB',
			price: 70,
			fee: 5,
			cost: 50,
			profit: 15,
			customer: 'Yolande Roberts',
		},
		{
			id: '1',
			date: '19.12 23:19',
			title: '4 x 28 Compartments Diamond/ Craft Storage Box',
			quantity: 5,
			status: 'Returned',
			dc: 'CPT',
			price: 105,
			fee: 46.58,
			cost: 60,
			profit: -34.5,
			customer: 'Rachel Cloete',
		},
		{
			id: '2',
			date: '23.12 14:32',
			title: 'Anti Snoring Nasal Plug',
			quantity: 3,
			status: 'Shipped',
			dc: 'CPT',
			price: 85,
			fee: 44.27,
			cost: 60,
			profit: 17,
			customer: 'Christine Laidlaw',
		},
	];

	const filteredData = data.filter((item) =>
		Object.values(item)
			.join(' ')
			.toLowerCase()
			.includes(searchText.toLowerCase())
	);

	const startIndex = (currentPage - 1) * +entriesPerPage;
	const endIndex = +startIndex + +entriesPerPage;
	const paginatedData =
		entriesPerPage === 'all'
			? filteredData
			: filteredData.slice(startIndex, endIndex);

	const columns = [
		{
			title: 'ID order',
			dataIndex: 'id',
			key: 'id',
			sorter: (a: { id: number }, b: { id: number }) => a.id - b.id,
			render: (id: string) => <span className="text-gray-500">{id}</span>,
		},
		{
			title: 'Date',
			dataIndex: 'date',
			key: 'date',
			sorter: (
				a: { date: string | number | Date },
				b: { date: string | number | Date }
			) => new Date(a.date).getTime() - new Date(b.date).getTime(),
		},
		{
			title: 'Title',
			dataIndex: 'title',
			key: 'title',
			sorter: (a: { title: string }, b: { title: string }) =>
				a.title.localeCompare(b.title),
			render: (title: string) => (
				<span
					className="hover:underline text-base font-bold hover:cursor-pointer"
					style={{ color: '#00215c' }}
				>
					{title}
				</span>
			),
		},
		{
			title: 'Quantity',
			dataIndex: 'quantity',
			key: 'quantity',
			align: 'center',
			sorter: (a: { quantity: number }, b: { quantity: number }) =>
				a.quantity - b.quantity,
			render: (quantity: number) => (
				<Tag className="p-1 w-8 bg-blue-950 rounded-lg text-white text-center text-base ">
					{quantity}
				</Tag>
			),
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			sorter: (a: { status: string }, b: { status: string }) =>
				a.status.localeCompare(b.status),
			render: (status: string) => {
				const color =
					status === 'Shipped'
						? 'green'
						: status === 'Returned'
						? 'red'
						: 'blue';
				return (
					<Tag className="p-1 w-24 text-center" color={color}>
						{status}
					</Tag>
				);
			},
		},
		{
			title: 'DC',
			dataIndex: 'dc',
			key: 'dc',
			sorter: (a: { dc: string }, b: { dc: string }) =>
				a.dc.localeCompare(b.dc),
			render: (dc: string) => <span className="text-gray-600">{dc}</span>,
		},
		{
			title: 'Price',
			dataIndex: 'price',
			key: 'price',
			sorter: (a: { price: number }, b: { price: number }) => a.price - b.price,
			render: (price: number) => <b>R {price}</b>,
		},
		{
			title: 'Fee',
			dataIndex: 'fee',
			key: 'fee',
			sorter: (a: { fee: number }, b: { fee: number }) => a.fee - b.fee,
			render: (fee: number) => (
				<Tag className="p-1 w-12 text-center text-base">{fee}</Tag>
			),
		},
		{
			title: 'Cost',
			dataIndex: 'cost',
			key: 'cost',
			render: () => (
				<div className="flex items-center">
					<Input
						placeholder="self cost"
						style={{ width: '70px' }}
						size="small"
					/>
					<Button
						className="bg-blue-950 text-white"
						icon={<CopyOutlined />}
						size="small"
					/>
				</div>
			),
		},
		{
			title: 'Profit',
			dataIndex: 'profit',
			key: 'profit',
			sorter: (a: { profit: number }, b: { profit: number }) =>
				a.profit - b.profit,
			render: (profit: number) => (
				<Tag className="p-1 w-20 text-center text-white text-base" color="red">
					{profit}
				</Tag>
			),
		},
		{
			title: 'Invoice for Customer',
			dataIndex: 'customer',
			key: 'customer',
			sorter: (a: { customer: string }, b: { customer: string }) =>
				a.customer.localeCompare(b.customer),
			render: (_: unknown, record: SaleData) => {
				const menuItems = [
					{ label: <Input placeholder="Field 1" />, key: '1' },
					{ label: <Input placeholder="Field 2" />, key: '2' },
					{ label: <Input placeholder="Field 3" />, key: '3' },
					{ label: <Input placeholder="Field 4" />, key: '4' },
					{
						label: (
							<Button type="primary" block>
								Submit
							</Button>
						),
						key: '5',
					},
				];
				return (
					<Dropdown
						menu={{ items: menuItems }}
						placement="bottom"
						trigger={['click']}
						arrow
					>
						<Button
							className="flex justify-between items-center text-[#7D879C]"
							style={{ width: '150px' }}
							icon={<DownOutlined />}
						>
							<span>{record.customer}</span>
						</Button>
					</Dropdown>
				);
			},
		},
	];

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchText(e.target.value);
	};

	const handlePageChange = (page: SetStateAction<number>) =>
		setCurrentPage(page);
	const handleEntriesChange = (value: number | 'all') => {
		setEntriesPerPage(value);
		setCurrentPage(1);
	};

	useEffect(() => {
		const timer = setTimeout(() => setLoading(false), 1000);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="p-4">
			<Skeleton
				active
				paragraph={{ rows: 10 }}
				loading={loading}
				title={{ width: 200 }}
			>
				<div className="p-4">
					<div className="flex justify-between items-center">
						<div>
							<span className="font-bold text-xl text-[#012970]">My Sales</span>
							<br />
							<span className="text-xs text-gray-700 p-4">Home / My Sales</span>
						</div>
						<Button
							type="primary"
							className="custom-btn bg-[#00215C] h-10 w-64 md:w-auto transition-colors duration-300"
							icon={<UndoOutlined />}
							iconPosition="start"
						>
							Update Sales
						</Button>
					</div>
				</div>
				<div className="bg-white shadow-md rounded-lg">
					<div className="flex justify-between p-4">
						<span className="text-[#899bbd] text-sm">
							<b className="text-xl text-[#012970] ">Filters </b>| All
						</span>
						<FilterMenuMySales onApplyFilters={() => {}} />
					</div>

					<div className="flex flex-col gap-4 md:flex-row md:justify-between md:gap-0 items-center p-2 mb-4">
						<div>
							<span className="text-gray-800 ml-6">Entries per page:</span>
							<Select
								//@ts-expect-error: Temporary workaround for Select value type mismatch
								defaultValue="10"
								style={{ width: 120 }}
								onChange={handleEntriesChange}
								options={[
									{ value: 5, label: '5' },
									{ value: 10, label: '10' },
									{ value: 15, label: '15' },
									{ value: 'all', label: 'All' },
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
							Showing {paginatedData.length} of {data.length} entries
						</span>
					</div>

					<Table
						//@ts-expect-error: Column data type mismatch for pagination
						columns={columns}
						className="overflow-x-auto md:overflow-x-hidden"
						dataSource={paginatedData}
						pagination={false}
						rowClassName={(record, index) =>
							index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
						}
						rowKey={(record) => record.id}
					/>

					{entriesPerPage !== 'all' && (
						<div className="flex justify-end mt-4">
							<Pagination
								current={currentPage}
								total={filteredData.length}
								pageSize={entriesPerPage}
								onChange={handlePageChange}
							/>
						</div>
					)}
				</div>
			</Skeleton>
		</div>
	);
}
