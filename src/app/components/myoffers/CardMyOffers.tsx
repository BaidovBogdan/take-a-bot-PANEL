'use client';
import { Line } from '@ant-design/plots';
import { ReloadOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { Tag, Modal, Input, Button } from 'antd';
import { useState } from 'react';

interface CardMyOffersProps {
	isVisible: boolean;
	onClose: () => void;
}

const EditOfferModal = ({ isVisible, onClose }: CardMyOffersProps) => {
	return (
		<Modal title="Edit Offer" open={isVisible} onCancel={onClose} footer={null}>
			<p className="mb-4">Offer updated successfully</p>
			<div className="grid grid-cols-2 gap-4">
				<div>
					<label className="block text-gray-700 mb-1">Min Price</label>
					<Input defaultValue="1.00" />
				</div>
				<div>
					<label className="block text-gray-700 mb-1">Self-cost Price</label>
					<Input defaultValue="None" />
				</div>
				<div>
					<label className="block text-gray-700 mb-1">Max Price</label>
					<Input defaultValue="232323.00" />
				</div>
				<div>
					<label className="block text-gray-700 mb-1">My Price</label>
					<Input defaultValue="23232.00" />
				</div>
			</div>
			<div className="mt-6 text-right">
				<Button
					onClick={onClose}
					type="primary"
					className="custom-btn bg-[#00215C] h-10 w-64 md:w-auto transition-colors duration-300"
				>
					Save changes
				</Button>
			</div>
		</Modal>
	);
};

const ChartComponentMyOffers = () => {
	const config = {
		data: {
			type: 'fetch',
			value:
				'https://gw.alipayobjects.com/os/bmw-prod/55424a73-7cb8-4f79-b60d-3ab627ac5698.json',
		},
		xField: (d: { year: Date }) => new Date(d.year),
		yField: 'value',
		sizeField: 'value',
		shapeField: 'trail',
		legend: false,
		colorField: 'category',
		height: 160,
	};
	return (
		<>
			<Line {...config} width={320} />
		</>
	);
};

export const CardMyOffers = () => {
	const [isDisabled, setIsDisabled] = useState(true);
	const [isModalVisible, setIsModalVisible] = useState(false);

	const handleClick = () => {
		setIsDisabled((prev) => !prev);
	};
	return (
		<div className="md:p-6 bg-white shadow-md rounded-lg w-full flex gap-5 h-full flex-col md:flex-row">
			<div className="flex items-center jus p-4">
				<Image src="/cosmetics.jpg" width={500} height={500} alt="product" />
			</div>
			<div className="p-4 w-full">
				<div className="flex flex-col gap-2">
					<b>ZYXC Professional Magic Gel Remover</b>
					<br />
					<div className="flex gap-10 items-center">
						<span className="text-gray-600">My price</span>
						<b className="text-[#dc3545] text-xl font-bold">R 23232.00</b>
					</div>
					<div className="flex md:gap-0 justify-between">
						<span className="text-gray-600">Market price</span>
						<p className="text-black">R 95.00</p>
						<span className="text-gray-600">Competitors:</span>
						<p className="text-black">0</p>
					</div>
					<div>
						<ChartComponentMyOffers />
					</div>
				</div>
			</div>
			<div className="p-4 w-full">
				<div className="flex flex-col gap-2">
					<div className="flex md:gap-0 justify-between">
						<span className="text-gray-600">Total sold unit</span>
						<p className="bg-[#00215C] text-center rounded-lg text-white p-1 w-8">
							5
						</p>
					</div>
					<div className="flex md:gap-0 justify-between">
						<Tag color="red">0</Tag>
						<Tag color="red">0</Tag>
						<Tag color="red">0</Tag>
					</div>
					<div className="flex md:gap-0 justify-between">
						<span className="text-gray-600">Revenue</span>
						<p className="text-black">R 570.00</p>
					</div>
					<div className="flex md:gap-0 justify-between">
						<span className="text-gray-600">Total profit</span>
						<p className="text-black">R 250.50</p>
					</div>
					<div className="flex md:gap-0 justify-between">
						<span className="text-gray-600">Avg. price</span>
						<p className="text-black">R 90.50</p>
					</div>
					<div className="flex md:gap-0 justify-between">
						<span className="text-gray-600">Total fee’s</span>
						<p className="text-black">R 319.50</p>
					</div>
					<div className="flex md:gap-0 justify-between">
						<span className="text-gray-600">Cost price</span>
						<span
							className="text-[#00215C] font-bold underline hover:text-blue-600 cursor-pointer hover:no-underline"
							onClick={() => setIsModalVisible(true)}
						>
							Set value
						</span>
					</div>
					<div className="flex md:gap-0 justify-between">
						<button className="bg-[#00215C] rounded-lg text-white p-1 w-20">
							<ReloadOutlined />
						</button>{' '}
						<button
							className="bg-[#00215C] rounded-lg text-white p-1 w-20"
							onClick={() => setIsModalVisible(true)}
						>
							Edit
						</button>
					</div>
				</div>
			</div>
			<div className="p-4 w-full">
				<div className="flex flex-col gap-2">
					<div className="flex md:gap-0 justify-between">
						<span className="text-gray-600">Autoprice status</span>
						<button
							className={`p-1 px-2 border-2 font-bold text-sm rounded-md ${
								isDisabled
									? 'text-red-500 border-red-500 bg-[#00215C]'
									: 'text-green-500 border-green-500 bg-[#00215C]'
							}`}
							onClick={handleClick}
						>
							{isDisabled ? 'DISABLE' : 'ENABLE'}
						</button>
					</div>
					<div className="flex md:gap-0 justify-between">
						<span className="text-gray-600">Min price</span>
						<p
							className="text-[#00215C] font-bold text-sm underline hover:text-blue-600 cursor-pointer hover:no-underline"
							onClick={() => setIsModalVisible(true)}
						>
							R 1.00
						</p>
						<span className="text-gray-600">Max price</span>
						<p
							className="text-[#00215C] font-bold text-sm underline hover:text-blue-600 cursor-pointer hover:no-underline"
							onClick={() => setIsModalVisible(true)}
						>
							R 232323.00
						</p>
					</div>
					<div className="flex md:gap-0 justify-between">
						<span className="text-gray-600">Weekly sales</span>
						<p className="text-black">None</p>
						<span className="text-gray-600">Monthly sales</span>
						<p className="text-black">4</p>
					</div>
					<div className="flex md:gap-0 justify-between">
						<span className="text-gray-600">Profit</span>
						<p className="text-green-500 font-bold text-sm">R 41.75</p>
					</div>
					<div>
						<ChartComponentMyOffers />
					</div>
				</div>
			</div>
			<EditOfferModal
				isVisible={isModalVisible}
				onClose={() => setIsModalVisible(false)}
			/>
		</div>
	);
};
