'use client';

import { CardComponent } from '../components/dashboard/CardComponent';
import { ChartComponent } from '../components/dashboard/Chart';
import { BestsellerCard } from '../components/dashboard/BestsellerCard';
import { RecentSales } from '../components/dashboard/RecentSales';
import { Button, Dropdown, Tooltip, Skeleton } from 'antd';
import {
	DollarTwoTone,
	FunnelPlotOutlined,
	ProjectTwoTone,
	ShoppingTwoTone,
	StopTwoTone,
	UndoOutlined,
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { menuItems } from '../components/dashboard/menuItems';
import { useDashboard } from '../api/api';
import { useAtom } from 'jotai';
import { DashboardData } from '../atoms/atoms';

export default function Dashboard() {
	const [loading, setLoading] = useState(true);
	const { getMyDashboard, wsTest } = useDashboard();
	const [dashboard] = useAtom(DashboardData);

	function highlightDetails(details: string) {
		return details.replace(
			/\b(None|\d+(\.\d+)?|-\d+(\.\d+)?( %| R)?)\b/g,
			'<span class="text-green-600 font-bold text-base">$&</span>'
		);
	}

	useEffect(() => {
		getMyDashboard();
		wsTest();
	}, []);

	const cardData = [
		{
			title: 'Sales ',
			subTitle: `| ${dashboard.sale_filter_label}`,
			value: `R ${dashboard.sales_amount}`,
			details: highlightDetails(
				`${dashboard.sales_units} items for ${dashboard.sales_total} sales.  Sale price avg. ~ ${dashboard.average_sale_amount}`
			),
			icon: <DollarTwoTone />,
		},
		{
			title: 'Returned ',
			subTitle: `| ${dashboard.ret_filter_label}`,
			value: `R ${dashboard.return_amount}`,
			details: highlightDetails(
				`${dashboard.return_units} items in ${dashboard.return_total} returns R ${dashboard.return_total_fee_sum} ~ Lost fee`
			),
			icon: <ShoppingTwoTone />,
		},
		{
			title: 'Cancellations ',
			subTitle: `| ${dashboard.can_filter_label}`,
			value: `R ${dashboard.cancelations_amount}`,
			details: highlightDetails(
				`${dashboard.cancelations_units} items in ${dashboard.cancelations_total} canceled R ${dashboard.cancelations_total_fee_sum} ~ Lost fee`
			),
			icon: <StopTwoTone />,
		},
		{
			title: 'Profit ',
			subTitle: '| All',
			value: 'R -34.50',
			details: highlightDetails(
				'Total fee: 2101.30 R ~ 101.67 % Product cost: 0 R ~ 0.00 % Margin: ~ -1.67 %'
			),
			icon: <ProjectTwoTone />,
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

	const salesData = [
		{
			id: 0,
			date: '02.01 20:08',
			product: 'Silicone Shampoo Brush',
			quantity: 1,
			status: 'DC Transfer',
			dc: 'JHB',
			price: 70,
			profit: 3,
		},
		{
			id: 1,
			date: '02.01 20:08',
			product: 'Silicone Shampoo Brush',
			quantity: 1,
			status: 'DC Transfer',
			dc: 'JHB',
			price: 70,
			profit: 1,
		},
		{
			id: 2,
			date: '23.12 14:32',
			product: 'Anti Snoring Nasal Plug',
			quantity: 1,
			status: 'Shipped',
			dc: 'CPT',
			price: 85,
			profit: 85,
		},
		{
			id: 3,
			date: '33.12 14:32',
			product: 'Anti Snoring Nasal Plug',
			quantity: 1,
			status: 'Shipped',
			dc: 'CPT',
			price: 85,
			profit: 85,
		},
		{
			id: 4,
			date: '43.12 14:32',
			product: 'Anti Snoring Nasal Plug',
			quantity: 1,
			status: 'Shipped',
			dc: 'CPT',
			price: 85,
			profit: 85,
		},
		{
			id: 5,
			date: '53.12 14:32',
			product: 'Anti Snoring Nasal Plug',
			quantity: 1,
			status: 'Shipped',
			dc: 'CPT',
			price: 85,
			profit: 85,
		},
		{
			id: 6,
			date: '53.12 14:32',
			product: 'Anti Snoring Nasal Plug',
			quantity: 1,
			status: 'Shipped',
			dc: 'CPT',
			price: 85,
			profit: 85,
		},
		{
			id: 7,
			date: '53.12 14:32',
			product: 'Anti Snoring Nasal Plug',
			quantity: 1,
			status: 'Shipped',
			dc: 'CPT',
			price: 85,
			profit: 85,
		},
		{
			id: 8,
			date: '53.12 14:32',
			product: 'Anti Snoring Nasal Plug',
			quantity: 1,
			status: 'Shipped',
			dc: 'CPT',
			price: 85,
			profit: 85,
		},
	];

	const [, setSelectedFilter] = useState('');

	const handleMenuClick = (e: { key: string }) => {
		setSelectedFilter(e.key);
	};

	useEffect(() => {
		const timer = setTimeout(() => setLoading(false), 1000);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="min-h-screen p-4 space-y-6">
			<div className="p-4 flex items-center flex-col md:flex-row md:justify-between gap-4">
				<div>
					<Skeleton
						active
						title={{ width: 200 }}
						paragraph={{ rows: 1, width: '60%' }}
						loading={loading}
					>
						<span className="font-bold text-xl text-[#012970]">Dashboard</span>
						<br />
						<span className="text-xs text-gray-700 p-4">Home / Dashboard</span>
					</Skeleton>
				</div>
				<div className="flex flex-col md:flex-row gap-3 md:gap-5 items-center">
					<Skeleton active loading={loading} className="w-full md:w-auto">
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
					</Skeleton>

					<Skeleton active loading={loading} className="w-full md:w-auto">
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
					</Skeleton>
				</div>
			</div>
			<div className="flex flex-col gap-5">
				<div className="flex flex-col md:flex-row gap-5">
					<div className="flex flex-col gap-4 w-full md:w-1/3">
						<Skeleton active loading={loading}>
							{cardData.map((card, index) => (
								<CardComponent
									key={index}
									subTitle={card.subTitle}
									title={card.title}
									value={card.value}
									details={card.details}
									icon={card.icon}
								/>
							))}
						</Skeleton>
						<div className="space-y-4">
							<Skeleton
								active
								loading={loading}
								paragraph={{ rows: 3, width: '100%' }}
							>
								<div className="bg-white shadow-md rounded-lg p-4">
									<div className="flex">
										<div>
											<span className="text-[#899bbd] text-sm">
												<b className="text-xl text-[#012970] ">Bestsellers </b>|
												All
											</span>
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
							</Skeleton>
						</div>
					</div>
					<div className="flex flex-col gap-4 w-full md:w-2/3">
						<Skeleton active loading={loading}>
							<ChartComponent />
						</Skeleton>
						<div>
							<Skeleton active loading={loading}>
								<RecentSales data={salesData} />
							</Skeleton>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
