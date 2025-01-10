'use client';

import { CardComponent } from '../components/dashboard/CardComponent';
import { ChartComponent } from '../components/dashboard/Chart';
import { BestsellerCard } from '../components/dashboard/BestsellerCard';
import { RecentSales } from '../components/dashboard/RecentSales';
import { Button, Dropdown, Tooltip, Skeleton } from 'antd';
import { useState, useEffect } from 'react';
import { menuItems } from '../components/dashboard/menuItems';

const Dashboard = () => {
	const [loading, setLoading] = useState(true);

	const cardData = [
		{
			title: 'Sales | Today',
			value: 'R None',
			details: 'None items for 0 sales',
			icon: '💵',
		},
		{
			title: 'Returned | All',
			value: 'R 105.00',
			details: '1 item in 1 returns',
			icon: '🔄',
		},
		{
			title: 'Cancellations | All',
			value: 'R None',
			details: 'None items in 0 cancelled',
			icon: '🚫',
		},
		{
			title: 'Profit | All',
			value: 'R -34.50',
			details: 'Total fee: 210.30',
			icon: '📉',
		},
	];

	const bestsellerData = [
		{
			image: '/profileTest.png',
			title: 'ZYXC Professional Magic Gel Remover',
			price: 95,
			totalPrice: 570,
			quantity: 6,
		},
		{
			image: '/profileTest.png',
			title: 'Colorful 5D Flower Nail Stickers',
			price: 90,
			totalPrice: 450,
			quantity: 5,
		},
		{
			image: '/profileTest.png',
			title: 'Colorful 5D Flower Nail Stickers',
			price: 90,
			totalPrice: 450,
			quantity: 5,
		},
		{
			image: '/profileTest.png',
			title: 'Colorful 5D Flower Nail Stickers',
			price: 90,
			totalPrice: 450,
			quantity: 5,
		},
		{
			image: '/profileTest.png',
			title: 'Colorful 5D Flower Nail Stickers',
			price: 90,
			totalPrice: 450,
			quantity: 5,
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

	const handleMenuClick = (e: any) => {
		setSelectedFilter(e.key);
	};

	useEffect(() => {
		const timer = setTimeout(() => setLoading(false), 1000);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="min-h-screen p-4 space-y-6">
			<div className="p-4 flex justify-between">
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
				<div className="flex gap-5 items-center">
					<Skeleton active loading={loading} className="w-full md:w-auto">
						<Dropdown
							menu={{ items: menuItems }}
							trigger={['click']}
							placement="bottomLeft"
						>
							<Button type="primary" className="bg-blue-500 w-full md:w-auto">
								Global Filters
							</Button>
						</Dropdown>
					</Skeleton>
					<Skeleton active loading={loading} className="w-full md:w-auto">
						<Tooltip placement="bottom" title="Click for update data">
							<Button type="primary" className="bg-blue-500 w-full md:w-auto">
								Update Sales
							</Button>
						</Tooltip>
					</Skeleton>
				</div>
			</div>
			<div className="flex gap-5">
				<div className="flex flex-col gap-4 w-1/3">
					<Skeleton active loading={loading}>
						{cardData.map((card, index) => (
							<CardComponent
								key={index}
								title={card.title}
								value={card.value}
								details={card.details}
								icon={card.icon}
							/>
						))}
					</Skeleton>
					<div className="md:col-span-1 space-y-4">
						<Skeleton
							active
							loading={loading}
							paragraph={{ rows: 3, width: '100%' }}
						>
							<div className="bg-white shadow-md rounded-lg p-4">
								<div className="flex justify-between">
									<p className="text-gray-500 font-bold">Bestsellers | All</p>
									<Dropdown
										menu={{ items: menuItems }}
										placement="bottomRight"
										trigger={['click']}
										arrow
									>
										<button className="text-[#7D879C] text-lg hover:text-gray-800">
											•••
										</button>
									</Dropdown>
								</div>
								{bestsellerData.map((item, index) => (
									<div className="mt-4">
										<BestsellerCard
											key={index}
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
				<div className="flex flex-col gap-4 w-2/3">
					<Skeleton active loading={loading}>
						<ChartComponent />
					</Skeleton>
					<div className="md:col-span-2">
						<Skeleton active loading={loading}>
							<RecentSales data={salesData} />
						</Skeleton>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
