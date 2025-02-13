'use client';

import {
	Table,
	Tag,
	Dropdown,
	Input,
	Button,
	Skeleton,
	Spin,
	message,
} from 'antd';
import { CopyOutlined, DownOutlined, UndoOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FilterMenuMySales } from '../components/mysales/MySalesFilterDropDown';
import { useAtom } from 'jotai';
import { burgerCheckAtom, mySalesData, SalesData } from '../atoms/atoms';
import { useSales } from '../api/api';

export default function MySales() {
	const [isUpdatedSales, setIsUpdatedSales] = useState(false);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [salesData, setSalesData] = useAtom(mySalesData);
	const { updateSales, getMySales, generateInvoice } = useSales();
	const [tableKey, setTableKey] = useState(0);
	const [isSidebarOpen] = useAtom(burgerCheckAtom);
	const socketRef = useRef<WebSocket | null>(null);
	const [dropdownOpen, setDropdownOpen] = useState<Record<number, boolean>>({});
	const [formValues, setFormValues] = useState({
		business_name: '',
		street: '',
		tax_number: '',
		reg_number: '',
	});

	// Handle changes for form fields
	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>, key: string) => {
			setFormValues((prev) => ({
				...prev,
				[key]: e.target.value,
			}));
		},
		[]
	);

	const toggleDropdown = (orderId: number, isOpen: boolean) => {
		setDropdownOpen((prev) => ({
			...prev,
			[orderId]: isOpen,
		}));
	};

	useEffect(() => {
		// Подключение к WebSocket
		const socket = new WebSocket('ws://34.44.207.107/api/v1/ws/sales');
		socketRef.current = socket;

		// Обработчик открытия соединения
		socket.onopen = () => {
			console.log('WebSocket соединение установлено');
		};

		// Обработчик получения сообщения
		socket.onmessage = (event) => {
			console.log('Получено сообщение:', event.data);
		};

		// Обработчик ошибок
		socket.onerror = (error) => {
			console.error('WebSocket ошибка:', error);
		};

		// Обработчик закрытия соединения
		socket.onclose = () => {
			console.log('WebSocket соединение закрыто');
		};

		// Чистка ресурса при размонтировании компонента
		return () => {
			if (socketRef.current) {
				socketRef.current.close();
			}
		};
	}, []);

	useEffect(() => {
		setTableKey((prev) => prev + 1);
	}, [isSidebarOpen]);

	useEffect(() => {
		setSalesData([]);
		updateSales(1);
		const timer = setTimeout(() => setLoading(false), 1000);
		return () => clearTimeout(timer);
	}, []);

	const loadMoreData = () => {
		const nextPage = page + 1;
		getMySales(nextPage, true);
		setPage(nextPage);
	};

	const columns = [
		{
			title: 'ID order',
			dataIndex: 'order_id',
			key: 'order_id',
			width: 108,
			sorter: (a: { order_id: number }, b: { order_id: number }) =>
				a.order_id - b.order_id,
			render: (id: string) => <span className="text-gray-500">{id}</span>,
		},
		{
			title: 'Date',
			dataIndex: 'formatted_order_date',
			key: 'formatted_order_date',
			width: 100,
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
			sorter: (a: { product_title: string }, b: { product_title: string }) =>
				(a.product_title || '').localeCompare(b.product_title || ''),
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
			width: 100,
			sorter: (a: { selling_price: number }, b: { selling_price: number }) =>
				a.selling_price - b.selling_price,
			render: (price: number) => <b>R {price}</b>,
		},
		{
			title: 'Fee',
			dataIndex: 'total_fee',
			key: 'total_fee',
			align: 'center',
			width: 100,
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
			width: 100,
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
			dataIndex: 'net_profit',
			key: 'net_profit',
			align: 'center',
			fixed: 'right',
			elipsis: true,
			width: 100,
			sorter: (a: { net_profit: number }, b: { net_profit: number }) =>
				a.net_profit - b.net_profit,
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
			width: 180,
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
									generateInvoice(record.order_item_id, { values: formValues });
									toggleDropdown(record.order_item_id, false);
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
						open={dropdownOpen[record.order_item_id] || false}
						onOpenChange={(isOpen) =>
							toggleDropdown(record.order_item_id, isOpen)
						}
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
	];

	const handleScroll = (e: React.UIEvent<HTMLTableElement>) => {
		const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
		if (scrollHeight - scrollTop === clientHeight && !loading) {
			loadMoreData();
		}
	};

	const handleUpdateSales = async () => {
		setIsUpdatedSales(true);
		try {
			setSalesData([]);
			await updateSales(1);
		} catch (error) {
			console.error('Ошибка обновления цен:', error);
		} finally {
			setIsUpdatedSales(false);
			getMySales(1, true);
			message.success('Sales updated successfully');
		}
	};

	return (
		<div className="p-4">
			<Skeleton
				active
				paragraph={{ rows: 10 }}
				loading={loading}
				title={{ width: 200 }}
			>
				<div className="p-4">
					<div className="flex-col md:flex-row flex gap-5 md:justify-between">
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
							onClick={handleUpdateSales}
							loading={isUpdatedSales}
						>
							Update Sales
						</Button>
					</div>
				</div>
				<div className="bg-white shadow-md rounded-lg min-h-[300px]">
					<div className="flex justify-between p-4">
						<span className="text-[#899bbd] text-sm">
							<b className="text-xl text-[#012970] ">Filters </b>| All
						</span>
						<FilterMenuMySales onApplyFilters={() => {}} />
					</div>

					<div className="flex flex-col gap-4 md:flex-row md:justify-center md:gap-0 items-center p-2 mb-4">
						<Input placeholder="Search" style={{ width: 200 }} />
					</div>
					{salesData.length > 0 ? (
						<Table
							columns={columns}
							dataSource={salesData}
							key={tableKey}
							pagination={false}
							rowClassName={(record, index) =>
								index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
							}
							scroll={{ x: 1500, y: 575 }}
							virtual
							rowKey={(record) => record.id}
							loading={loading}
							onScroll={handleScroll}
						/>
					) : (
						<div className="flex justify-center items-center">
							<Spin />
						</div>
					)}
				</div>
			</Skeleton>
		</div>
	);
}
