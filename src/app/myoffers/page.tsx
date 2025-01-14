'use client';
import {
	ControlOutlined,
	FunnelPlotOutlined,
	RetweetOutlined,
} from '@ant-design/icons';
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

	const { Option } = Select;

	return (
		<Skeleton
			active
			title={{ width: 200 }}
			paragraph={{ rows: 10, width: '100%' }}
			loading={loading}
			className="p-4"
		>
			<div className="min-h-screen p-4 space-y-6">
				<div className="p-4 flex-col md:flex-row flex gap-5 md:justify-between">
					<div>
						<span className="font-bold text-xl text-[#012970]">My Offers</span>
						<br />
						<span className="text-xs text-gray-700 p-4">Home / My Offers</span>
					</div>
					<div className="flex gap-5 items-center">
						<Button
							type="primary"
							className="custom-btn bg-[#00215C] h-10 w-64 md:w-auto transition-colors duration-300"
							icon={<RetweetOutlined />}
							iconPosition="start"
						>
							Prices
						</Button>

						<Button
							type="primary"
							className="custom-btn bg-[#00215C] h-10 w-64 md:w-auto transition-colors duration-300"
							icon={<RetweetOutlined />}
							iconPosition="start"
						>
							Offers
						</Button>
					</div>
				</div>
				<div className="bg-white rounded-lg shadow-md">
					<div className="flex flex-col gap-2 md:flex-row md:justify-between items-center p-4">
						<div className="flex items-center gap-2">
							<span className="text-gray-800 ml-6">Entries per page:</span>
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
						<div className="flex gap-7 mr-9 text-[#012970] font-bold">
							<div className="flex gap-4">Sort {<ControlOutlined />}</div>
							<span>|</span>
							<div className="flex gap-4">Filter {<FunnelPlotOutlined />}</div>
						</div>
					</div>
					<div className="flex justify-center">
						<Input
							placeholder="Search"
							className="w-64"
							addonBefore={
								<Select defaultValue="TSIN" style={{ width: 75 }}>
									<Option value="TSIN">TSIN</Option>
									<Option value="Title">Title</Option>
								</Select>
							}
						/>
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
