'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Drawer } from 'antd';
import {
	DashboardOutlined,
	ShoppingOutlined,
	GiftOutlined,
	AppstoreOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
	MenuUnfoldOutlined,
	MenuFoldOutlined,
	MenuOutlined,
	SettingOutlined,
	UserOutlined,
	SolutionOutlined,
	InsertRowRightOutlined,
	QuestionOutlined,
	CustomerServiceOutlined,
	LogoutOutlined,
	ArrowUpOutlined,
} from '@ant-design/icons';
import { useAtom } from 'jotai';
import { myStoreData, selectedStore, myProfileData } from '../../atoms/atoms';
import { usePathname, useRouter } from 'next/navigation';
import { useChangeProfile } from '@/app/api/useProfile';
import { useLogout } from '@/app/api/api';

const { Sider } = Layout;

const siderStyle: React.CSSProperties = {
	overflow: 'auto',
	height: '100vh',
	position: 'sticky',
	insetInlineStart: 0,
	top: 0,
	bottom: 0,
	scrollbarWidth: 'thin',
	scrollbarGutter: 'stable',
};

export const Sidebar: React.FC = () => {
	const { logout } = useLogout();
	const [collapsed, setCollapsed] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [stores] = useAtom(myStoreData);
	const [selectedStoreId, setSelectedStoreId] = useAtom(selectedStore);
	const [profileData] = useAtom(myProfileData);
	const { selectStore } = useChangeProfile();
	const router = useRouter();
	const [, setScrollPosition] = useState(0);
	const [showScrollButton, setShowScrollButton] = useState(false);
	const [, setScrollPositionDeckstop] = useState(0);
	const [showScrollButtonDesktop, setShowScrollButtonDesktop] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const [defaultSelectedKey, setDefaultSelectedKey] = useState('');

	useEffect(() => {
		setDefaultSelectedKey(window.location.pathname);
	}, []);

	useEffect(() => {
		if (typeof window === 'undefined') return;

		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
		};

		window.addEventListener('resize', handleResize);
		handleResize();

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const toggleCollapsed = () => {
		setCollapsed(!collapsed);
	};

	const handleStoreClick = async (id: number) => {
		await selectStore(id);
		setSelectedStoreId(id);
	};

	//@ts-ignore
	useEffect(() => {
		//@ts-ignore
		if (!selectedStoreId && profileData?.active_store_id) {
			//@ts-ignore
			setSelectedStoreId(profileData.active_store_id);
		} //@ts-ignore
	}, [profileData?.active_store_id, selectedStoreId]);

	const menuItems = [
		...(Array.isArray(stores) && stores.length > 0
			? [
					{
						label: 'My Stores',
						key: 'mystores',
						icon: <AppstoreOutlined style={{ fontSize: 15 }} />,
						children: stores
							.filter((store) => store?.company_name)
							.map((store) => ({
								icon:
									selectedStoreId === store.id ? (
										<CheckCircleOutlined
											style={{ fontSize: 15, color: 'blue' }}
										/>
									) : (
										<CloseCircleOutlined
											style={{ fontSize: 15, color: 'red' }}
										/>
									),
								label: store.company_name,
								key: store.id,
								onClick: () => handleStoreClick(store.id),
							})),
					},
			  ]
			: []),
		{
			label: 'Dashboard',
			key: '/dashboard',
			icon: <DashboardOutlined style={{ fontSize: 15 }} />,
			onClick: () => router.push('/dashboard'),
			disabled: stores.length === 0,
		},
		{
			label: 'My Sales',
			key: '/mysales',
			icon: <ShoppingOutlined style={{ fontSize: 15 }} />,
			onClick: () => router.push('/mysales'),
			disabled: stores.length === 0,
		},
		{
			label: 'My Offers',
			key: '/myoffers',
			icon: <GiftOutlined style={{ fontSize: 15 }} />,
			onClick: () => router.push(`/myoffers/${selectedStoreId}`),
			disabled: stores.length === 0,
		},
		{
			label: 'General',
			key: 'general',
			icon: <SettingOutlined style={{ fontSize: 15 }} />,
			children: [
				{
					label: 'Profile',
					key: '/users/profile',
					icon: <UserOutlined style={{ fontSize: 12 }} />,
					onClick: () => router.push('/users/profile'),
				},
				{
					label: 'Price Checker',
					key: '/mybot',
					icon: <SolutionOutlined style={{ fontSize: 12 }} />,
					onClick: () => router.push('/mybot'),
				},
				{
					label: 'Guidebook',
					key: 'guidebook',
					icon: <InsertRowRightOutlined style={{ fontSize: 12 }} />,
					onClick: () =>
						router.push(
							'https://takeabot.notion.site/5beb86c0b14e4f238bf0b22e6bbb20ed?v=3f220ded47244ed79966b28b136773fe'
						),
				},
				{
					label: 'F.A.Q',
					key: 'faq',
					icon: <QuestionOutlined style={{ fontSize: 12 }} />,
					onClick: () => router.push('https://dev-house.co.za/#faq'),
				},
				{
					label: 'Contact',
					key: 'contact',
					icon: <CustomerServiceOutlined style={{ fontSize: 12 }} />,
					onClick: () => router.push('https://dev-house.co.za/#contact'),
				},
			],
		},
		{
			label: 'Logout',
			key: 'logout',
			icon: <LogoutOutlined style={{ fontSize: 15 }} />,
			onClick: () => logout(),
		},
	];

	useEffect(() => {
		const handleScroll = () => {
			setScrollPosition(window.scrollY); // Update scroll position
			if (window.scrollY > 50) {
				setShowScrollButton(true); // Show button if scrolled down more than 50px
			} else {
				setShowScrollButton(false); // Hide button if at the top
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			if (typeof window === 'undefined') return;
			setScrollPosition(window.scrollY);
			setShowScrollButton(window.scrollY > 50);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	// Scroll to the top when the button is clicked
	const scrollToTop = () => {
		if (typeof window === 'undefined') return;
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<>
			{/* Для мобильных устройств */}
			{isMobile ? (
				<>
					<Button
						className="absolute mt-5 ml-1 md:hidden"
						type="primary"
						icon={<MenuOutlined />}
						onClick={() => setIsOpen(true)}
						style={{ zIndex: 100 }}
					/>
					<Drawer
						title="Menu"
						placement="left"
						closable={true}
						onClose={() => setIsOpen(false)}
						open={isOpen}
						width={250}
						className="md:hidden"
					>
						<Menu
							theme="light"
							defaultSelectedKeys={[defaultSelectedKey]}
							mode="inline"
							items={menuItems}
							onClick={() => setIsOpen(false)}
						/>
					</Drawer>
				</>
			) : (
				// Для десктопных устройств
				<Sider
					collapsible
					style={siderStyle}
					collapsed={collapsed}
					onCollapse={toggleCollapsed}
					className="hidden md:block"
					theme="light"
				>
					<br />
					<Button type="primary" onClick={toggleCollapsed} className="ml-3">
						{collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
					</Button>
					<br />
					<br />
					<Menu
						defaultSelectedKeys={defaultSelectedKey ? [defaultSelectedKey] : []}
						rootClassName="custom-menu"
						mode="inline"
						items={menuItems}
					/>
				</Sider>
			)}

			{showScrollButton && (
				<Button
					className="fixed mt-5 ml-1 z-50 md:hidden"
					type="primary"
					icon={<ArrowUpOutlined />}
					onClick={scrollToTop}
				/>
			)}
			{showScrollButtonDesktop && (
				<Button
					className="z-50 hidden md:flex"
					type="primary"
					icon={<ArrowUpOutlined />}
					onClick={scrollToTop}
					style={{
						position: 'fixed',
						bottom: '20px',
						right: '20px',
						borderRadius: '50%',
						width: '40px',
						height: '40px',
						fontSize: '20px',
					}}
				/>
			)}
		</>
	);
};
