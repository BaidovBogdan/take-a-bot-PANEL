import React, { useState, useEffect } from 'react';
import { Menu, Skeleton } from 'antd';
import {
	DashboardOutlined,
	ShoppingOutlined,
	GiftOutlined,
	UserOutlined,
	AppstoreOutlined,
	SolutionOutlined,
	SettingOutlined,
	InsertRowRightOutlined,
	QuestionOutlined,
	CustomerServiceOutlined,
	LogoutOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
} from '@ant-design/icons';
import { useAtom } from 'jotai';
import { myStoreData, selectedStore, myProfileData } from '../../atoms/atoms';
import { useChangeProfile, useLogout } from '@/app/api/api';
import { usePathname, useRouter } from 'next/navigation';

interface SidebarProps {
	className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [stores] = useAtom(myStoreData);
	const [openKeys, setOpenKeys] = useState<string[]>([]);
	const [selectedStoreId, setSelectedStoreId] = useAtom(selectedStore);
	const [profileData] = useAtom(myProfileData);
	const { selectStore } = useChangeProfile();
	const router = useRouter();
	const pathname = usePathname();
	const { logout } = useLogout();

	const handleStoreClick = async (id: number) => {
		await selectStore(id); // Меняем активный магазин через API
		setSelectedStoreId(id); // Обновляем состояние в атоме
	};

	useEffect(() => {
		if (
			profileData.active_store_id &&
			profileData.active_store_id !== selectedStoreId
		) {
			setSelectedStoreId(profileData.active_store_id || stores[0].id);
		}
	}, [profileData.active_store_id, selectedStoreId, setSelectedStoreId]);

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
		},
		{
			label: 'My Sales',
			key: '/mysales',
			icon: <ShoppingOutlined style={{ fontSize: 15 }} />,
			onClick: () => router.push('/mysales'),
		},
		{
			label: 'My Offers',
			key: '/myoffers',
			icon: <GiftOutlined style={{ fontSize: 15 }} />,
			onClick: () => router.push(`/myoffers/${selectedStoreId}`),
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
		const timer = setTimeout(() => {
			setLoading(false);
		}, 1000);

		return () => clearTimeout(timer);
	}, []);

	const onOpenChange = (keys: string[]) => {
		setOpenKeys(keys); // Update the state of open menu items
		console.log(openKeys);
	};

	return (
		<div
			className={`text-blue-700 mt-16 3xl:mt-0 h-screen 3xl:h-[calc(100vh-100px)] rounded-md flex-shrink-0 ${
				!loading ? 'bg-white shadow-md' : ''
			}  ${className || ''} fixed 3xl:relative z-50`}
		>
			{loading ? (
				<Skeleton avatar paragraph={{ rows: 6 }} active />
			) : (
				<Menu
					mode="inline"
					items={menuItems}
					openKeys={openKeys} // Managed open keys state
					onOpenChange={onOpenChange} // Handle open/close actions
					selectedKeys={[pathname]}
					className="text-[#012970]"
					style={{
						color: '#012970',
					}}
					rootClassName="custom-menu"
					onClick={(info) => console.log(info.key)}
					forceSubMenuRender={true} // Forces the rendering of the submenus (helps with opening/closing)
				/>
			)}
		</div>
	);
};
