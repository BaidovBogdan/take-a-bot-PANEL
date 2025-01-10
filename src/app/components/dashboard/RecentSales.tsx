'use client';

import { Table, Tag, Pagination, Select } from 'antd';
import { useState } from 'react';

export const RecentSales = ({ data }: any) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [entriesPerPage, setEntriesPerPage] = useState(10);

	const startIndex = (currentPage - 1) * entriesPerPage;
	const endIndex = startIndex + entriesPerPage;
	const paginatedData =
		entriesPerPage === 'all' ? data : data.slice(startIndex, endIndex);

	const columns = [
		{
			title: 'Date',
			dataIndex: 'date',
			key: 'date',
			sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
		},
		{
			title: 'Product',
			dataIndex: 'product',
			key: 'product',
			sorter: (a, b) => a.product.localeCompare(b.product),
		},
		{
			title: 'Qty',
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
			title: 'Profit',
			dataIndex: 'profit',
			key: 'profit',
			sorter: (a, b) => a.profit - b.profit,
		},
	];

	const handlePageChange = (page) => setCurrentPage(page);
	const handleEntriesChange = (value) => {
		setEntriesPerPage(value === 'all' ? 'all' : parseInt(value));
		setCurrentPage(1);
	};

	return (
		<div className="bg-white shadow-md rounded-lg p-4">
			<p className="text-gray-500 font-bold">Recent Sales | All</p>
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
				<span className="text-gray-600">
					Showing {paginatedData.length} of {data.length} entries
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
						total={data.length}
						pageSize={entriesPerPage}
						onChange={handlePageChange}
					/>
				</div>
			)}
		</div>
	);
};
