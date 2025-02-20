import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import {
	UserOutlined,
	SettingOutlined,
	BookOutlined,
	LogoutOutlined,
} from '@ant-design/icons';
import Image from 'next/image';
import { Divider, Dropdown } from 'antd';
import { useLogout } from '../../api/api';
import { myProfileData } from '../../atoms/atoms';
import { ItemType } from 'antd/es/menu/interface';

export const Header = () => {
	const [profileData] = useAtom(myProfileData);
	const { logout } = useLogout();
	const router = useRouter();

	const handleLogout = async () => {
		await logout();
		router.push('/auth/login');
	};

	const handleProfile = () => {
		router.push('/users/profile');
	};

	const ProfileDropdown = () => {
		const menuItems: ItemType[] = [
			{
				label: 'My Profile',
				key: 'profile',
				icon: <UserOutlined />,
				onClick: handleProfile,
			},
			{ type: 'divider' as const },
			{
				label: 'Account Settings',
				key: 'settings',
				icon: <SettingOutlined />,
			},
			{ type: 'divider' },
			{
				label: 'Manual',
				key: 'manual',
				icon: <BookOutlined />,
			},
			{ type: 'divider' },
			{
				label: 'Logout',
				key: 'logout',
				icon: <LogoutOutlined />,
				danger: true,
				onClick: handleLogout,
			},
		];

		return (
			<Dropdown
				menu={{
					items: menuItems,
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
					<div className="flex items-center">
						{Array.isArray(profileData) && profileData.length > 0 ? (
							<span>{profileData[0].first_name}</span>
						) : (
							<span>No profile data available</span>
						)}
						<span className="ml-1 text-sm">▼</span>
					</div>
				</div>
			</Dropdown>
		);
	};

	return (
		<header
			className="flex justify-between p-4 bg-white shadow-2xl"
			onContextMenu={(e) => e.preventDefault()}
		>
			<div className="flex gap-1 cursor-pointer ml-8 md:-ml-4">
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
