'use client';
import { Line } from '@ant-design/plots';
import { ReloadOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { Tag, Modal, Input, Button } from 'antd';
import { useState } from 'react';
import { OffersData } from '@/app/atoms/atoms';
import { useOffers } from '@/app/api/api';

interface CardMyOffersProps {
	isVisible: boolean;
	onClose: () => void;
	id: number;
}

interface CardMyOffersProps {
	offer: OffersData;
}

const EditOfferModal = ({ isVisible, onClose, id }: CardMyOffersProps) => {
	const { editOffers } = useOffers();
	const [minPrice, setMinPrice] = useState('');
	const [selfCostPrice, setSelfCostPrice] = useState('');
	const [maxPrice, setMaxPrice] = useState('');
	const [myPrice, setMyPrice] = useState('');

	const handleEditOffer = () => {
		editOffers({
			offer_id: id,
			min_price: Number(minPrice),
			max_price: Number(maxPrice),
			cost_price: Number(selfCostPrice),
			selling_price: Number(myPrice),
		});
		onClose();
	};

	return (
		<Modal title="Edit Offer" open={isVisible} onCancel={onClose} footer={null}>
			<div className="grid grid-cols-2 gap-4">
				<div>
					<label className="block text-gray-700 mb-1">Min Price</label>
					<Input
						placeholder="Please enter min price"
						value={minPrice}
						onChange={(e) => setMinPrice(e.target.value)}
					/>
				</div>
				<div>
					<label className="block text-gray-700 mb-1">Self-cost Price</label>
					<Input
						placeholder="Please enter self-cost price"
						value={selfCostPrice}
						onChange={(e) => setSelfCostPrice(e.target.value)}
					/>
				</div>
				<div>
					<label className="block text-gray-700 mb-1">Max Price</label>
					<Input
						placeholder="Please enter max price"
						value={maxPrice}
						onChange={(e) => setMaxPrice(e.target.value)}
					/>
				</div>
				<div>
					<label className="block text-gray-700 mb-1">My Price</label>
					<Input
						placeholder="Please enter my price"
						value={myPrice}
						onChange={(e) => setMyPrice(e.target.value)}
					/>
				</div>
			</div>
			<div className="mt-6 text-right">
				<Button
					onClick={() => handleEditOffer()}
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

export const CardMyOffers: React.FC<{ offer: OffersData }> = ({ offer }) => {
	const [isDisabled, setIsDisabled] = useState(true);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const { autoPriceOffers } = useOffers();

	const isMinOrMaxPriceNull =
		offer.min_price === null || offer.max_price === null;

	const handleClick = () => {
		setIsDisabled((prev) => !prev);
		autoPriceOffers(offer.id);
	};
	return (
		<div
			className="lg:p-6 bg-white w-full flex gap-5 h-full flex-col lg:flex-row"
			key={offer.id}
		>
			<div className="flex items-center p-4 justify-center">
				<Image src={offer.image_url} width={500} height={500} alt="product" />
			</div>
			<div className="p-4 w-full">
				<div className="flex flex-col gap-2">
					<b>{offer.title}</b>
					<br />
					<div className="flex gap-10 items-center">
						<span className="text-gray-600">My price</span>
						<b className="text-[#dc3545] text-xl font-bold">R 23232.00</b>
					</div>
					<div className="flex lg:gap-0 justify-between">
						<span className="text-gray-600">Market price</span>
						<p className="text-black">R 95.00</p>
						<span className="text-gray-600">Competitors:</span>
						<p className="text-black">{offer.competitors}</p>
					</div>
					<div>
						<ChartComponentMyOffers />
					</div>
				</div>
			</div>
			<div className="p-4 w-full">
				<div className="flex flex-col gap-2">
					<div className="flex lg:gap-0 justify-between">
						<span className="text-gray-600">Total sold unit</span>
						<p className="bg-[#00215C] text-center rounded-lg text-white p-1 w-8">
							{offer.total_sales_units}
						</p>
					</div>
					<div className="flex lg:gap-0 justify-between">
						<Tag color="red">0</Tag>
						<Tag color="red">0</Tag>
						<Tag color="red">0</Tag>
					</div>
					<div className="flex lg:gap-0 justify-between">
						<span className="text-gray-600">Revenue</span>
						<p className="text-black">R 570.00</p>
					</div>
					<div className="flex lg:gap-0 justify-between">
						<span className="text-gray-600">Total profit</span>
						<p className="text-black">{offer.total_profit} </p>
					</div>
					<div className="flex lg:gap-0 justify-between">
						<span className="text-gray-600">Avg. price</span>
						<p className="text-black">R 90.50</p>
					</div>
					<div className="flex lg:gap-0 justify-between">
						<span className="text-gray-600">Total fee’s</span>
						<p className="text-black">R 319.50</p>
					</div>
					<div className="flex lg:gap-0 justify-between">
						<span className="text-gray-600">Cost price</span>
						<span
							className="text-[#00215C] font-bold underline hover:text-blue-600 cursor-pointer hover:no-underline"
							onClick={() => setIsModalVisible(true)}
						>
							Set value
						</span>
					</div>
					<div className="flex lg:gap-0 justify-between">
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
					<div className="flex lg:gap-0 justify-between">
						<span className="text-gray-600">Autoprice status</span>
						<button
							className={`p-1 px-2 border-2 font-bold text-sm rounded-md ${
								isMinOrMaxPriceNull
									? 'text-white border-red-500 bg-[#00215C]'
									: !offer.autoprice
									? 'text-red-500 border-red-500 bg-[#00215C]'
									: isDisabled
									? 'text-red-500 border-red-500 bg-[#00215C]'
									: 'text-green-500 border-green-500 bg-[#00215C]'
							}`}
							onClick={
								isMinOrMaxPriceNull
									? () => setIsModalVisible(true)
									: handleClick
							}
						>
							{isMinOrMaxPriceNull
								? 'Set min/max price'
								: !offer.autoprice
								? 'DISABLE'
								: isDisabled
								? 'DISABLE'
								: 'ENABLE'}
						</button>
					</div>
					<div className="flex lg:gap-0 justify-between">
						<span className="text-gray-600">Min price</span>
						<p
							className="text-[#00215C] font-bold text-sm underline hover:text-blue-600 cursor-pointer hover:no-underline"
							onClick={() => setIsModalVisible(true)}
						>
							{offer.min_price}
						</p>
						<span className="text-gray-600">Max price</span>
						<p
							className="text-[#00215C] font-bold text-sm underline hover:text-blue-600 cursor-pointer hover:no-underline"
							onClick={() => setIsModalVisible(true)}
						>
							{offer.max_price}
						</p>
					</div>
					<div className="flex lg:gap-0 justify-between">
						<span className="text-gray-600">Weekly sales</span>
						<p className="text-black">None</p>
						<span className="text-gray-600">Monthly sales</span>
						<p className="text-black">4</p>
					</div>
					<div className="flex lg:gap-0 justify-between">
						<span className="text-gray-600">Profit</span>
						<p className="text-green-500 font-bold text-sm">R 41.75</p>
					</div>
					<div>
						<ChartComponentMyOffers />
					</div>
				</div>
			</div>
			<EditOfferModal
				offer_id={offer.id}
				isVisible={isModalVisible}
				onClose={() => setIsModalVisible(false)}
			/>
		</div>
	);
};
