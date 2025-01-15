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
		{ label: 'My Sales', key: '/mysales', icon: <ShoppingOutlined /> },
		{ label: 'My Offers', key: '/myoffers', icon: <GiftOutlined /> },
		{ label: 'Profile', key: '/users/profile', icon: <UserOutlined /> },
	];

	useEffect(() => {
		const timer = setTimeout(() => {
			setLoading(false);
		}, 1000);

		return () => clearTimeout(timer);
	}, []);

	const sidebarClass = visible
		? 'translate-x-0 animate-sidebar'
		: 'translate-x-full animate-sidebar-closed';

	return (
		<div
			className={`text-blue-700 mt-16 3xl:mt-0 h-screen rounded-md flex-shrink-0 transition-transform duration-300 ease-in-out ${
				!loading ? 'bg-white shadow-md' : ''
			} ${sidebarClass} ${className || ''} fixed 3xl:relative z-50`}
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
