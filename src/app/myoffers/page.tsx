'use client';

import { CardMyOffers } from '../components/myoffers/CardMyOffers';
import { Button, Input, Select, Skeleton } from 'antd';
import { useState, useEffect } from 'react';

export default function MyOffers() {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => setLoading(false), 1000);
		return () => clearTimeout(timer);
	}, []);

	function handleEntriesChange() {
		throw new Error('Function not implemented.');
	}

	return (
		<Skeleton
			active
			title={{ width: 200 }}
			paragraph={{ rows: 10, width: '100%' }}
			loading={loading}
			className="p-4"
		>
			<div className="min-h-screen p-4 space-y-6">
				<div className="p-4 flex gap-5 md:justify-between">
					<div>
						<span className="font-bold text-xl text-[#012970]">My Offers</span>
						<br />
						<span className="text-xs text-gray-700 p-4">Home / My Offers</span>
					</div>
					<div className="flex gap-5 items-center">
						<Button type="primary" className="bg-blue-500 w-full md:w-auto">
							Prices
						</Button>

						<Button type="primary" className="bg-blue-500 w-full md:w-auto">
							Offers
						</Button>
					</div>
				</div>
				<div className="bg-white rounded-lg shadow-md">
					<div className="flex flex-col gap-2 md:flex-row md:justify-between items-center p-4">
						<div className="flex items-center gap-2">
							<span className="font-bold text-gray-800 mr-2">
								Entries per page:
							</span>
							<Select
								defaultValue="10"
								style={{ width: 120 }}
								onChange={handleEntriesChange}
								options={[
									{ value: '5', label: '5' },
									{ value: '10', label: '10' },
									{ value: '15', label: '15' },
									{ value: 'all', label: 'All' },
								]}
							/>
						</div>
						<div className="flex gap-5 mr-9">
							<span>Sort</span>
							<span>|</span>
							<span>Filter</span>
						</div>
					</div>
					<div className="flex justify-center">
						<Input placeholder="Search" className="w-64" />
					</div>
					<div className="flex gap-5 justify-center bg-white shadow-md rounded-lg p-4">
						<div className="flex flex-col gap-10 md:gap-4 w-auto p-4 md:p-4">
							<CardMyOffers />
							<CardMyOffers />
							<CardMyOffers />
						</div>
					</div>
				</div>
			</div>
		</Skeleton>
	);
}
