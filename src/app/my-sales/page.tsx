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
import { CopyOutlined, DownOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { FilterMenuMySales } from '../components/mysales/MySalesFilterDropDown';

export default function MySales() {
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [entriesPerPage, setEntriesPerPage] = useState(10);
	const [searchText, setSearchText] = useState('');

	const data = [
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

	const startIndex = (currentPage - 1) * entriesPerPage;
	const endIndex = startIndex + entriesPerPage;
	const paginatedData =
		entriesPerPage === 'all'
			? filteredData
			: filteredData.slice(startIndex, endIndex);

	const columns = [
		{
			title: 'ID order',
			dataIndex: 'id',
			key: 'id',
			sorter: (a, b) => a.id - b.id,
		},
		{
			title: 'Date',
			dataIndex: 'date',
			key: 'date',
			sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
		},
		{
			title: 'Title',
			dataIndex: 'title',
			key: 'title',
			sorter: (a, b) => a.title.localeCompare(b.title),
		},
		{
			title: 'Quantity',
			dataIndex: 'quantity',
			key: 'quantity',
			align: 'center',
			sorter: (a, b) => a.quantity - b.quantity,
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			sorter: (a, b) => a.status.localeCompare(b.status),
			render: (status) => {
				let color =
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
			sorter: (a, b) => a.dc.localeCompare(b.dc),
		},
		{
			title: 'Price',
			dataIndex: 'price',
			key: 'price',
			sorter: (a, b) => a.price - b.price,
		},
		{
			title: 'Fee',
			dataIndex: 'fee',
			key: 'fee',
			sorter: (a, b) => a.fee - b.fee,
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
					<Button icon={<CopyOutlined />} size="small" />
				</div>
			),
		},
		{
			title: 'Profit',
			dataIndex: 'profit',
			key: 'profit',
			sorter: (a, b) => a.profit - b.profit,
		},
		{
			title: 'Invoice for Customer',
			dataIndex: 'customer',
			key: 'customer',
			sorter: (a, b) => a.customer.localeCompare(b.customer),
			render: (_, record) => {
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
							iconPosition="end"
						>
							<span>{record.customer}</span>
						</Button>
					</Dropdown>
				);
			},
		},
	];

	const handleSearchChange = (e) => {
		setSearchText(e.target.value);
	};

	const handlePageChange = (page) => setCurrentPage(page);
	const handleEntriesChange = (value: string | number) => {
		setEntriesPerPage(value === 'all' ? 'all' : parseInt(value));
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
				avatar
				title={{ width: 200 }}
			>
				<div className="p-4">
					<div className="flex justify-between items-center">
						<div>
							<span className="font-bold text-xl text-[#012970]">My Sales</span>
							<br />
							<span className="text-xs text-gray-700 p-4">Home / My Sales</span>
						</div>
						<Button type="primary" className="bg-blue-500 w-full md:w-auto">
							Update Sales
						</Button>
					</div>
				</div>
				<div className="bg-white shadow-md rounded-lg">
					<div className="p-4 flex justify-between">
						<div className="text-gray-500 font-bold">Filters | All</div>
						<FilterMenuMySales key={1} />
					</div>

					<div className="flex justify-between items-center p-2 mb-4">
						<div>
							<span className="font-bold text-gray-800 mr-2">
								Entries per page:
							</span>
							<Select
								defaultValue="10"
								style={{ width: 120 }}
								onChange={handleEntriesChange}
								options={[
									{ value: '5', label: '5' },
									{ value: '10', label: '10' },
									{ value: '15', label: '15' },
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
							Showing {paginatedData.length} of {filteredData.length} entries
						</span>
					</div>

					<Table
						columns={columns}
						dataSource={paginatedData}
						pagination={false}
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
