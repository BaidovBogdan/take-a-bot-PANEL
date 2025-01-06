// components/sidebar/Sidebar.tsx
import React from 'react';
import { Menu } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  GiftOutlined,
  UserOutlined,
} from '@ant-design/icons';

export const Sidebar: React.FC = () => {
  const menuItems = [
    { label: 'Dashboard', key: '/dashboard', icon: <DashboardOutlined /> },
    { label: 'My Sales', key: '/my-sales', icon: <ShoppingOutlined /> },
    { label: 'My Offers', key: '/my-offers', icon: <GiftOutlined /> },
    { label: 'Profile', key: '/profile', icon: <UserOutlined /> },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white h-screen">
      <div className="p-4 text-center font-bold text-lg">My App</div>
      <Menu
        theme="dark"
        mode="inline"
        items={menuItems}
        onClick={({ key }) => {
          window.location.href = key;
        }}
      />
    </div>
  );
};
