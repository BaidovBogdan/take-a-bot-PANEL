'use client';

import { Skeleton, Tabs } from 'antd';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createTabItems } from '../../components/users/profile/Tab';

export default function Profile() {
	const [loadingPage, setLoadingPage] = useState(true);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setLoadingPage(false);
		}, 1000);
		return () => clearTimeout(timer);
	}, []);

	const tabItems = createTabItems(loading);

	const handleTabChange = () => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
		}, 1000);
	};

	return (
		<div className="flex flex-col gap-4">
			{loadingPage ? (
				<Skeleton active paragraph={{ rows: 4 }} />
			) : (
				<div>
					<div>
						<span className="font-bold text-xl text-[#012970]">Profile</span>{' '}
						<br />{' '}
						<span className="text-xs text-gray-700">
							Home / Users / Profile
						</span>
					</div>
					<div className="flex flex-col md:flex-row md:justify-start">
						<div className="p-5 md:ml-32">
							<div className="flex flex-col items-center text-center">
								<Image
									src={'/profileTest.png'}
									alt="avatar"
									width={120}
									height={120}
								/>
								<span>name</span>
								<span>mail</span>
								<b>Free</b>
							</div>
						</div>
						<div className="w-full">
							<Tabs
								defaultActiveKey="1"
								items={tabItems}
								className="w-full"
								onChange={handleTabChange}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
