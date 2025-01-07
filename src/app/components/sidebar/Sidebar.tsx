import React, { useState, useEffect } from 'react';
import { Menu, Skeleton } from 'antd';
import {
	DashboardOutlined,
	ShoppingOutlined,
	GiftOutlined,
	UserOutlined,
} from '@ant-design/icons';

interface SidebarProps {
	className?: string;
	visible: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ className, visible }) => {
	const [loading, setLoading] = useState(true);

	const menuItems = [
		{ label: 'Dashboard', key: '/dashboard', icon: <DashboardOutlined /> },
		{ label: 'My Sales', key: '/my-sales', icon: <ShoppingOutlined /> },
		{ label: 'My Offers', key: '/my-offers', icon: <GiftOutlined /> },
		{ label: 'Profile', key: '/users/profile', icon: <UserOutlined /> },
	];

	useEffect(() => {
		const timer = setTimeout(() => {
			setLoading(false);
		}, 1000);

		return () => clearTimeout(timer);
	}, []);

	return (
		<div
			className={`text-blue-700 h-screen flex-shrink-0 transition-transform duration-250 ${
				visible ? 'translate-x-0' : '-translate-x-full'
			} ${className || ''}`}
		>
			{loading ? (
				<Skeleton avatar paragraph={{ rows: 6 }} active />
			) : (
				<Menu
					mode="inline"
					items={menuItems}
					onClick={({ key }) => {
						window.location.href = key;
					}}
				/>
			)}
		</div>
	);
};
