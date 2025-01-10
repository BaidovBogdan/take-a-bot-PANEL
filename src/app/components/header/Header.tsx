import { AlignCenterOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import {
	UserOutlined,
	SettingOutlined,
	BookOutlined,
	LogoutOutlined,
} from '@ant-design/icons';
import { burgerCheckAtom } from '../../atoms/atoms';
import Image from 'next/image';
import { Dropdown, Menu, Skeleton } from 'antd'; // Импортируем Skeleton
import { useEffect, useState } from 'react';

export const Header = () => {
	const [, setBurgerCheckA] = useAtom(burgerCheckAtom);
	const router = useRouter();

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => setLoading(false), 1000);
		return () => clearTimeout(timer);
	}, []);

	if (loading) {
		return (
			<header
				className="flex justify-between p-4"
				onContextMenu={(e) => e.preventDefault()}
			>
				<div className="flex gap-1 cursor-pointer">
					<Skeleton.Avatar active size="large" className="w-8 h-8" />
					<Skeleton.Input active size="small" className="w-32 h-8" />
				</div>
				<div className="flex gap-1 cursor-pointer">
					<Skeleton.Avatar active size="large" className="w-12 h-12" />
					<Skeleton.Input active size="small" className="w-24 h-8" />
				</div>
			</header>
		);
	}

	const ProfileDropdown = () => {
		const menuItems = [
			{
				label: 'My Profile',
				key: 'profile',
				icon: <UserOutlined />,
			},
			{
				label: 'Account Settings',
				key: 'settings',
				icon: <SettingOutlined />,
			},
			{
				label: 'Manual',
				key: 'manual',
				icon: <BookOutlined />,
			},
			{
				label: 'Logout',
				key: 'logout',
				icon: <LogoutOutlined />,
				danger: true,
			},
		];

		return (
			<Dropdown
				menu={{
					items: menuItems,
					onClick: ({ key }) => {
						console.log(`Menu item clicked: ${key}`);
					},
				}}
				trigger={['click']}
				placement="bottomRight"
				arrow
			>
				<div className="flex gap-1 cursor-pointer items-center">
					<Image
						src={'/profileTest.png'}
						className="rounded-full"
						alt="Avatar"
						width={50}
						height={50}
						priority
					/>
					<span className="flex items-center">
						test <span className="ml-1 text-sm">▼</span>
					</span>
				</div>
			</Dropdown>
		);
	};

	return (
		<header
			className="flex justify-between p-4 bg-white shadow-md"
			onContextMenu={(e) => e.preventDefault()}
		>
			<div className="flex gap-1 cursor-pointer">
				<AlignCenterOutlined
					className="text-2xl"
					onClick={() => setBurgerCheckA((prev: boolean) => !prev)}
				/>
				<Image
					src={'/takeabotLOGO.png'}
					alt="Logo"
					width={150}
					layout="intrinsic"
					priority
					height={90}
					onClick={() => router.push('/dashboard')}
				/>
			</div>
			<div className="flex gap-1 cursor-pointer">
				<ProfileDropdown />
			</div>
		</header>
	);
};
