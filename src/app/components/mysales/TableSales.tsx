'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { Table, Tag, Dropdown, Input, Button, message } from 'antd';
import { CopyOutlined, DownOutlined } from '@ant-design/icons';
import { useSales } from '@/app/api/useSales';
import { SalesData } from '../../atoms/atoms';
import debounce from 'lodash.debounce';

interface SalesTableProps {
	salesData: SalesData[];
	loadMore: () => void;
}

export const SalesTable: React.FC<SalesTableProps> = React.memo(
	({ salesData, loadMore }) => {
		const { generateInvoice, changeCostPrice } = useSales();
		const [formValues, setFormValues] = useState({
			business_name: '',
			street: '',
			tax_number: '',
			reg_number: '',
		});
		const [openDropdown, setOpenDropdown] = useState<number | null>(null);
		const [costPrices, setCostPrices] = useState<Record<number, string>>({});

		const handleChangeCostPrice = (offer_id: number, cost_price: string) => {
			changeCostPrice(offer_id, cost_price);
		};

		const handleScroll = (e: React.UIEvent<HTMLTableElement>) => {
			const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
			if (scrollHeight - scrollTop === clientHeight) {
				loadMore();
			}
		};

		const toggleDropdown = useCallback((orderId: number) => {
			setOpenDropdown((prev) => (prev === orderId ? null : orderId));
		}, []);

		const debouncedHandleInputChange = useMemo(
			() =>
				debounce((e: React.ChangeEvent<HTMLInputElement>, key: string) => {
					setFormValues((prev) => ({
						...prev,
						[key]: e.target.value,
					}));
				}, 100),
			[]
		);

		const handleInputChange = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>, key: string) => {
				debouncedHandleInputChange(e, key);
			},
			[debouncedHandleInputChange]
		);

		const handleInputChangeCost = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>, offerId: number) => {
				const value = e.target.value;
				setCostPrices((prev) => ({ ...prev, [offerId]: value }));
			},
			[]
		);

		const columns = useMemo(
			() => [
				{
					title: 'ID order',
					dataIndex: 'order_id',
					key: 'order_id',
					width: 108,
					className: 'animated-column',
					sorter: (a: { order_id: number }, b: { order_id: number }) =>
						a.order_id - b.order_id,
					render: (id: string) => <span className="text-gray-500">{id}</span>,
				},
				{
					title: 'Date',
					dataIndex: 'formatted_order_date',
					key: 'formatted_order_date',
					width: 100,
					className: 'animated-column',
					sorter: (
						a: { formatted_order_date: string },
						b: { formatted_order_date: string }
					) =>
						new Date(a.formatted_order_date).getTime() -
						new Date(b.formatted_order_date).getTime(),
				},
				{
					title: 'Title',
					dataIndex: 'product_title',
					key: 'product_title',
					width: 300,
					className: 'animated-column',
					sorter: (
						a: { product_title: string },
						b: { product_title: string }
					) => (a.product_title || '').localeCompare(b.product_title || ''),
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
					width: 100,
					key: 'quantity',
					align: 'center',
					className: 'animated-column',
					sorter: (a: { quantity: number }, b: { quantity: number }) =>
						a.quantity - b.quantity,
					render: (quantity: number) => (
						<Tag className="p-1 w-8 bg-blue-950 rounded-lg text-white text-center text-base">
							{quantity}
						</Tag>
					),
				},
				{
					title: 'Status',
					dataIndex: 'sale_status',
					width: 200,
					key: 'sale_status',
					className: 'animated-column',
					sorter: (a: { sale_status: string }, b: { sale_status: string }) =>
						(a.sale_status || '').localeCompare(b.sale_status || ''),
					render: (status: string) => {
						const color =
							status === 'Shipped'
								? 'green'
								: status === 'Returned'
								? 'red'
								: 'blue';
						return (
							<Tag className="p-1 w-36 text-center" color={color}>
								{status}
							</Tag>
						);
					},
				},
				{
					title: 'DC',
					dataIndex: 'dc',
					key: 'dc',
					align: 'center',
					className: 'animated-column',
					width: 100,
					sorter: (a: { dc: string }, b: { dc: string }) =>
						(a.dc || '').localeCompare(b.dc || ''),
					render: (dc: string) => <span className="text-gray-600">{dc}</span>,
				},
				{
					title: 'Price',
					dataIndex: 'selling_price',
					key: 'selling_price',
					align: 'center',
					className: 'animated-column',
					width: 100,
					sorter: (
						a: { selling_price: number },
						b: { selling_price: number }
					) => a.selling_price - b.selling_price,
					render: (price: number) => <b>R {price}</b>,
				},
				{
					title: 'Fee',
					dataIndex: 'total_fee',
					key: 'total_fee',
					align: 'center',
					width: 100,
					className: 'animated-column',
					sorter: (a: { total_fee: number }, b: { total_fee: number }) =>
						a.total_fee - b.total_fee,
					render: (fee: number) => (
						<Tag className="p-1 w-14 text-center text-base">{fee}</Tag>
					),
				},
				{
					title: 'Cost',
					dataIndex: 'cost',
					key: 'cost',
					align: 'center',
					className: 'animated-column',
					width: 100,
					render: (_: any, record: SalesData) => {
						const offerId = record.id;
						const costPriceValue = costPrices[offerId] || '';
						return (
							<div className="flex items-center">
								<Input
									placeholder="self cost"
									style={{ width: 90 }}
									value={costPriceValue}
									onChange={(e) => handleInputChangeCost(e, offerId)}
									size="small"
								/>
								<Button
									className="bg-blue-950 text-white"
									icon={<CopyOutlined />}
									size="small"
									onClick={() => handleChangeCostPrice(offerId, costPriceValue)}
								/>
							</div>
						);
					},
				},
				{
					title: 'Profit',
					dataIndex: 'net_profit',
					key: 'net_profit',
					align: 'center',
					fixed: 'right',
					elipsis: true,
					className: 'animated-column',
					width: 100,
					sorter: (a: { net_profit: number }, b: { net_profit: number }) =>
						a.net_profit - b.net_profit,
					render: (profit: number) => (
						<Tag
							className="p-1 w-20 text-center text-white text-base"
							color="red"
						>
							{profit}
						</Tag>
					),
				},
				{
					title: 'Invoice for Customer',
					dataIndex: 'customer',
					key: 'customer',
					width: 180,
					className: 'animated-column',
					align: 'center',
					sorter: (a: { customer: string }, b: { customer: string }) =>
						(a.customer || '').localeCompare(b.customer || ''),
					render: (_: unknown, record: SalesData) => {
						const menuItems = (record: SalesData) => [
							{
								label: (
									<Input
										placeholder="Business Name"
										value={formValues.business_name}
										onChange={(e) => handleInputChange(e, 'business_name')}
										onClick={(e) => e.stopPropagation()}
									/>
								),
								key: '1',
							},
							{
								label: (
									<Input
										placeholder="Street"
										value={formValues.street}
										onChange={(e) => handleInputChange(e, 'street')}
										onClick={(e) => e.stopPropagation()}
									/>
								),
								key: '2',
							},
							{
								label: (
									<Input
										placeholder="Tax Number"
										value={formValues.tax_number}
										onChange={(e) => handleInputChange(e, 'tax_number')}
										onClick={(e) => e.stopPropagation()}
									/>
								),
								key: '3',
							},
							{
								label: (
									<Input
										placeholder="Registration Number"
										value={formValues.reg_number}
										onChange={(e) => handleInputChange(e, 'reg_number')}
										onClick={(e) => e.stopPropagation()}
									/>
								),
								key: '4',
							},
							{
								label: (
									<Button
										type="primary"
										block
										onClick={() => {
											generateInvoice(record.order_item_id, {
												values: formValues,
											});
											setFormValues({
												business_name: '',
												street: '',
												tax_number: '',
												reg_number: '',
											});
											setTimeout(() => {
												setOpenDropdown(null);
											}, 1000);
										}}
									>
										Submit
									</Button>
								),
								key: '5',
							},
						];

						return (
							<Dropdown
								menu={{ items: menuItems(record) }}
								placement="bottom"
								trigger={['click']}
								open={openDropdown === record.order_item_id}
								onOpenChange={() => toggleDropdown(record.order_item_id)}
								arrow
							>
								<Button
									className="flex items-center text-[#7D879C] w-36"
									icon={<DownOutlined />}
								>
									<span className="truncate">{record.customer}</span>
								</Button>
							</Dropdown>
						);
					},
				},
			],
			[
				formValues,
				openDropdown,
				handleInputChange,
				toggleDropdown,
				costPrices,
				generateInvoice,
				handleChangeCostPrice,
				handleInputChangeCost,
			]
		);

		return (
			<Table
				//@ts-ignore
				columns={columns}
				dataSource={salesData}
				pagination={false}
				rowClassName={(record, index) =>
					index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
				}
				scroll={{ y: 575 }}
				virtual
				onScroll={handleScroll}
				rowKey={(record) => record.id}
			/>
		);
	}
);
