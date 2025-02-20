'use client';

import { CardComponent } from '../components/dashboard/CardComponent';
import { ChartComponent } from '../components/dashboard/Chart';
import { BestsellerCard } from '../components/dashboard/BestsellerCard';
import { RecentSales } from '../components/dashboard/RecentSales';
import { Button, Dropdown, Tooltip } from 'antd';
import {
	DollarTwoTone,
	FunnelPlotOutlined,
	HomeOutlined,
	ProjectTwoTone,
	ShoppingTwoTone,
	StopTwoTone,
	UndoOutlined,
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useDashboard } from '../api/useDashboard';
import { useAtom } from 'jotai';
import { DashboardData, DashboardI } from '../atoms/atoms';

type MenuItem =
	| { key: string; label: string; type?: undefined }
	| { type: 'divider'; key?: undefined; label?: undefined };

export default function Dashboard() {
	const { getMyDashboard, getSalesTable } = useDashboard();
	//@ts-ignore
	const [dashboard] = useAtom<DashboardI>(DashboardData);
	const [, setSelectedFilter] = useState('');
	const [salesFilter, setSalesFilter] = useState('');
	const [retFilter, setRetFilter] = useState('');
	const [canFilter, setCanFilter] = useState('');
	const [chartFilter, setChartFilter] = useState('');
	const [tableFilter, setTableFilter] = useState('');

	const handleSalesFilter = (filter: string) => {
		setSalesFilter(filter);
		getMyDashboard(filter, retFilter, canFilter, chartFilter, tableFilter);
	};
	const handleRetFilter = (filter: string) => {
		setRetFilter(filter);
		getMyDashboard(salesFilter, filter, canFilter, chartFilter, tableFilter);
	};
	const handleCanFilter = (filter: string) => {
		setCanFilter(filter);
		getMyDashboard(salesFilter, retFilter, filter, chartFilter, tableFilter);
	};

	const handleChartFilter = (filter: string) => {
		setChartFilter(filter);
		getMyDashboard(salesFilter, retFilter, canFilter, filter, tableFilter);
	};
	const handleTableFilter = (filter: string) => {
		setTableFilter(filter);
		getMyDashboard(salesFilter, retFilter, canFilter, chartFilter, filter);
	};

	function highlightDetails(details: string) {
		return details.replace(
			/\b(None|\d+(\.\d+)?|-\d+(\.\d+)?( %| R)?)\b/g,
			'<span class="text-green-600 font-bold text-base">$&</span>'
		);
	}

	const menuItems: MenuItem[] = [
		{ key: 'today', label: 'Today' },
		{ key: 'thisWeek', label: 'This Week' },
		{ key: 'thisMonth', label: 'This Month' },
		{ key: 'thisYear', label: 'This Year' },
		{ type: 'divider' },
		{ key: 'last7Days', label: 'Last 7 Days' },
		{ key: 'last90Days', label: 'Last 90 Days' },
		{ key: 'all', label: 'All' },
		{ type: 'divider' },
	];

	useEffect(() => {
		//@ts-ignore
		getMyDashboard();
		getSalesTable();
	}, []);

	const salesDataFormatted =
		dashboard?.recent_sales && Array.isArray(dashboard.recent_sales)
			? dashboard.recent_sales.map((sale) => {
					return {
						id: sale.id, // Assuming the offer_id can serve as a unique identifier
						formatted_order_date: sale.formatted_order_date || '', // Replace with actual sale date field if available
						product_title: sale.product_title || 'Unknown Product', // Make sure this matches your data
						quantity: sale.quantity || 0,
						sale_status: sale.sale_status || 'Unknown', // Use appropriate status from sale
						dc: sale.dc || 'Unknown', // Make sure the data structure matches
						selling_price: sale.selling_price || 0,
						net_profit: sale.net_profit || 0, // Ensure net_profit is the correct field
					};
			  })
			: [];

	const cardData = [
		{
			title: 'Sales ',
			subTitle: `| ${dashboard.sale_filter_label}`,
			value: `R ${dashboard.sales_amount}`,
			details: highlightDetails(
				`${dashboard.sales_units} items for ${dashboard.sales_total} sales.  Sale price avg. ~ ${dashboard.average_sale_amount}`
			),
			icon: <DollarTwoTone />,
			filter: salesFilter,
			onFilterChange: handleSalesFilter,
		},
		{
			title: 'Returned ',
			subTitle: `| ${dashboard.ret_filter_label}`,
			value: `R ${dashboard.return_amount}`,
			details: highlightDetails(
				`${dashboard.return_units} items in ${dashboard.return_total} returns R ${dashboard.return_total_fee_sum} ~ Lost fee`
			),
			icon: <ShoppingTwoTone />,
			filter: retFilter,
			onFilterChange: handleRetFilter,
		},
		{
			title: 'Cancellations ',
			subTitle: `| ${dashboard.can_filter_label}`,
			value: `R ${dashboard.cancelations_amount}`,
			details: highlightDetails(
				`${dashboard.cancelations_units} items in ${dashboard.cancelations_total} canceled R ${dashboard.cancelations_total_fee_sum} ~ Lost fee`
			),
			icon: <StopTwoTone />,
			filter: canFilter,
			onFilterChange: handleCanFilter,
		},
		{
			title: 'Profit ',
			subTitle: '| All',
			value: 'R -34.50',
			details: highlightDetails(
				'Total fee: 2101.30 R ~ 101.67 % Product cost: 0 R ~ 0.00 % Margin: ~ -1.67 %'
			),
			icon: <ProjectTwoTone />,
			filter: '',
			onFilterChange: () => {},
		},
	];

	const bestsellerData = dashboard?.top_sales?.length
		? dashboard.top_sales.map((item, index) => ({
				image: item.image_url || '/profileTest.png',
				title: item.product_title || 'No Title',
				price: item.price || 0,
				totalPrice: item.total_money || 0,
				quantity: item.total_quantity || 0,
		  }))
		: [
				{
					image: '/profileTest.png',
					title: 'No data available',
					price: 0,
					totalPrice: 0,
					quantity: 0,
				},
		  ];

	const handleMenuClick = (e: { key: string }) => {
		setSelectedFilter(e.key);
	};

	return (
		<div className="min-h-screen p-4 space-y-6">
			<div className="p-4 flex items-center flex-col md:flex-row md:justify-between gap-4">
				<div>
					<span className="font-bold text-xl text-[#012970]">Dashboard</span>
					<br />
					<div className="text-xs text-gray-700 p-4 flex gap-1">
						<div className="flex items-center">
							<HomeOutlined />
						</div>{' '}
						/ Dashboard
					</div>
				</div>
				<div className="flex flex-col md:flex-row gap-3 md:gap-5 items-center">
					<Dropdown
						menu={{ items: menuItems, onClick: handleMenuClick }}
						trigger={['click']}
						placement="bottomLeft"
					>
						<Button
							type="primary"
							className="custom-btn bg-[#00215C] h-10 w-64 md:w-auto transition-colors duration-300"
							icon={<FunnelPlotOutlined />}
							iconPosition="start"
						>
							Global Filters
						</Button>
					</Dropdown>

					<Tooltip placement="bottom" title="Click for update data">
						<Button
							type="primary"
							className="custom-btn bg-[#00215C] h-10 w-64 md:w-auto transition-colors duration-300"
							icon={<UndoOutlined />}
							iconPosition="start"
						>
							Update Sales
						</Button>
					</Tooltip>
				</div>
			</div>
			<div className="flex flex-col gap-5">
				<div className="flex flex-col md:flex-row gap-5">
					<div className="flex flex-col gap-4 w-full md:w-1/3">
						{cardData.map((card, index) => (
							<CardComponent
								key={index}
								subTitle={card.subTitle}
								title={card.title}
								value={card.value}
								details={card.details}
								icon={card.icon}
								filter={card.filter}
								onFilterChange={card.onFilterChange}
							/>
						))}

						<div className="space-y-4">
							<div className="bg-white shadow-md rounded-lg p-4">
								<div className="flex">
									<div>
										<div className="text-[#899bbd] text-sm">
											<b className="text-xl text-[#012970] ">Bestsellers </b>|{' '}
											{''}
											{dashboard.top_filter_label}
										</div>
									</div>
								</div>
								{bestsellerData.map((item, index) => (
									<div className="mt-4" key={index}>
										<BestsellerCard
											image={item.image}
											title={item.title}
											price={item.price}
											totalPrice={item.totalPrice}
											quantity={item.quantity}
										/>
									</div>
								))}
							</div>
						</div>
					</div>
					<div className="flex flex-col gap-4 w-full md:w-2/3">
						<ChartComponent
							dashboard={dashboard}
							handleChartFilter={handleChartFilter}
						/>
						<div>
							<RecentSales
								label={dashboard.rec_filter_label}
								data={salesDataFormatted}
								handleTableFilter={handleTableFilter}
								tableFilter={tableFilter}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
