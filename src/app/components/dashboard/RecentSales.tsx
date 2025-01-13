'use client';

import { Table, Tag, Pagination, Select } from 'antd';
import { useState } from 'react';

interface SaleRecord {
	id: string | number;
	date: string | Date;
	product: string;
	quantity: number;
	status: string;
	dc: string;
	price: number;
	profit: number;
}

interface RecentSalesProps {
	data: SaleRecord[];
}

export const RecentSales = ({ data }: RecentSalesProps) => {
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [entriesPerPage, setEntriesPerPage] = useState<string | number>(10);

	const startIndex = (currentPage - 1) * Number(entriesPerPage);
	const endIndex = startIndex + Number(entriesPerPage);
	const paginatedData =
		entriesPerPage === 'all' ? data : data.slice(startIndex, endIndex);

	const columns = [
		{
			title: 'Date',
			dataIndex: 'date',
			key: 'date',
			sorter: (a: SaleRecord, b: SaleRecord) =>
				new Date(a.date).getTime() - new Date(b.date).getTime(),
		},
		{
			title: 'Product',
			dataIndex: 'product',
			key: 'product',
			sorter: (a: SaleRecord, b: SaleRecord) =>
				a.product.localeCompare(b.product),
		},
		{
			title: 'Qty',
			dataIndex: 'quantity',
			key: 'quantity',
			align: 'center',
			sorter: (a: SaleRecord, b: SaleRecord) => a.quantity - b.quantity,
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			sorter: (a: SaleRecord, b: SaleRecord) =>
				a.status.localeCompare(b.status),
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
		},
		{
			title: 'Price',
			dataIndex: 'price',
			key: 'price',
			sorter: (a: SaleRecord, b: SaleRecord) => a.price - b.price,
		},
		{
			title: 'Profit',
			dataIndex: 'profit',
			key: 'profit',
			sorter: (a: SaleRecord, b: SaleRecord) => a.profit - b.profit,
		},
	];

	const handlePageChange = (page: number) => setCurrentPage(page);
	const handleEntriesChange = (value: string | number) => {
		setEntriesPerPage(value === 'all' ? 'all' : Number(value));
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
				className="overflow-x-auto md:overflow-x-hidden"
				//@ts-expect-error Ignore TypeScript error due to type mismatch between columns and Table component
				columns={columns}
				dataSource={paginatedData}
				pagination={false}
				rowKey={(record) => record.id.toString()}
			/>

			{entriesPerPage !== 'all' && (
				<div className="flex justify-end mt-4">
					<Pagination
						current={currentPage}
						total={data.length}
						pageSize={Number(entriesPerPage)}
						onChange={handlePageChange}
					/>
				</div>
			)}
		</div>
	);
};
