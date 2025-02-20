'use client';
import { Line } from '@ant-design/plots';
import { ReloadOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { Tag, Modal, Input, Button, Skeleton, Spin, Form } from 'antd';
import React, { useEffect, useState } from 'react';
import { OffersData } from '@/app/atoms/atoms';
import { useOffers } from '@/app/api/useOffers';

interface CardMyOffersProps {
	isVisible: boolean;
	onClose: () => void;
	offer_id: number;
	newCard: () => void;
}

const EditOfferModal = ({
	isVisible,
	onClose,
	offer_id,
	newCard,
}: CardMyOffersProps) => {
	const { editOffers } = useOffers();
	const [form] = Form.useForm();

	const handleEditOffer = () => {
		form
			.validateFields()
			.then((values) => {
				editOffers({
					id: offer_id,
					min_price: Number(values.minPrice),
					max_price: Number(values.maxPrice),
					cost_price: Number(values.selfCostPrice),
					selling_price: Number(values.myPrice),
				});
				onClose();
			})
			.catch((info) => {
				console.error('Ошибка валидации:', info);
			})
			.finally(() => {
				newCard();
			});
	};

	useEffect(() => {
		if (!isVisible) {
			form.resetFields();
		}
	}, [isVisible, form]);
	return (
		<Modal title="Edit Offer" open={isVisible} onCancel={onClose} footer={null}>
			<Form form={form} layout="vertical">
				<Form.Item
					label="Min Price"
					name="minPrice"
					rules={[
						{ required: true, message: 'Please enter min price' },
						{
							validator(_, value) {
								if (value && Number(value) >= 0) {
									return Promise.resolve();
								}
								return Promise.reject(
									new Error('Min price must be greater than or equal to 0')
								);
							},
						},
					]}
				>
					<Input placeholder="Please enter min price" />
				</Form.Item>

				<Form.Item
					label="Self-cost Price"
					name="selfCostPrice"
					rules={[
						{ required: true, message: 'Please enter self-cost price' },
						{
							validator(_, value) {
								if (value && Number(value) >= 0) {
									return Promise.resolve();
								}
								return Promise.reject(
									new Error(
										'Self-cost price must be greater than or equal to 0'
									)
								);
							},
						},
					]}
				>
					<Input placeholder="Please enter self-cost price" />
				</Form.Item>

				<Form.Item
					label="Max Price"
					name="maxPrice"
					rules={[
						{ required: true, message: 'Please enter max price' },
						{
							validator(_, value) {
								if (value && Number(value) > 0) {
									return Promise.resolve();
								}
								return Promise.reject(
									new Error('Max price must be greater than 0')
								);
							},
						},
					]}
				>
					<Input placeholder="Please enter max price" />
				</Form.Item>

				<Form.Item
					label="My Price"
					name="myPrice"
					dependencies={['minPrice', 'maxPrice']}
					rules={[
						{ required: true, message: 'Please enter my price' },
						({ getFieldValue }) => ({
							validator(_, value) {
								const minPrice = Number(getFieldValue('minPrice'));
								const maxPrice = Number(getFieldValue('maxPrice'));
								const myPrice = Number(value);

								if (myPrice >= minPrice && myPrice <= maxPrice) {
									return Promise.resolve();
								}
								return Promise.reject(
									new Error('My price must be between min price and max price')
								);
							},
						}),
					]}
				>
					<Input placeholder="Please enter my price" />
				</Form.Item>

				<div className="mt-6 text-right">
					<Button
						onClick={handleEditOffer}
						type="primary"
						className="custom-btn bg-[#00215C] h-10 w-64 md:w-auto transition-colors duration-300"
					>
						Save changes
					</Button>
				</div>
			</Form>
		</Modal>
	);
};

interface LineData {
	total_quantity: number[];
	labels: string[];
}

const ChartComponentMyOffers = ({ lineData }: { lineData: LineData }) => {
	const config = {
		data: lineData.total_quantity.map((quantity, index) => ({
			label: lineData.labels[index], // метка для оси X
			total_quantity: quantity, // значение для оси Y
		})),
		xField: 'label', // Это будет привязано к меткам дней недели
		yField: 'total_quantity', // Привязываем к значениям total_quantity
		height: 160,
		point: { size: 5 }, // можно настроить размер точек, если хотите
		lineStyle: {
			lineWidth: 2,
			stroke: '#4CAF50', // Цвет линии
		},
		animate: { enter: { type: 'zoomIn' } },
	};
	return <Line {...config} width={360} />;
};

export const CardMyOffers: React.FC<{
	offer: OffersData;
	newCard: () => void;
}> = React.memo(({ offer, newCard }) => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const { autoPriceOffers, getChart } = useOffers();
	const [isViewChart, setIsViewChart] = useState(true);
	const [chartData, setChartData] = useState<LineData>({
		total_quantity: [],
		labels: [],
	});
	const [isLoadedChart, setIsLoadedChart] = useState(false);

	const handleViewChart = async () => {
		setIsLoadedChart(true);
		try {
			const data = await getChart(offer.id);
			setChartData(data);
		} catch (error) {
			console.error('Error fetching chart data:', error);
		} finally {
			setIsViewChart(false);
			setIsLoadedChart(false);
		}
	};

	const isMinOrMaxPriceNull =
		offer.min_price === null ||
		offer.min_price === 0 ||
		offer.max_price === null ||
		offer.max_price === 0;

	const handleClick = () => {
		autoPriceOffers(offer.id);
	};

	const SkeletonChart = () => {
		return (
			<div className="cursor-pointer" onClick={handleViewChart}>
				<Skeleton.Node active style={{ height: 160, width: 360 }}>
					{!isLoadedChart ? 'Click for show chart' : <Spin />}
				</Skeleton.Node>
			</div>
		);
	};
	return (
		<div
			className="lg:p-3 bg-white w-full flex gap-5 h-full flex-col lg:flex-row"
			key={offer.id}
		>
			<div className="flex items-center p-1 justify-center">
				<Image src={offer.image_url} width={500} height={500} alt="product" />
			</div>
			<div className="p-1 w-full">
				<div className="flex flex-col gap-2">
					<b>{offer.title}</b>
					<br />
					<div className="flex gap-10 items-center">
						<span className="text-gray-600">My price</span>
						<b className="text-[#dc3545] text-xl font-bold">
							R {offer.selling_price}
						</b>
					</div>
					<div className="flex lg:gap-0 justify-between">
						<span className="text-gray-600">Market price</span>
						<p className="text-black">R 95.00</p>
						<span className="text-gray-600">Competitors:</span>
						<p className="text-black">{offer.competitors}</p>
					</div>
					<div>
						{!isViewChart ? (
							<ChartComponentMyOffers key={offer.id} lineData={chartData} />
						) : (
							<SkeletonChart />
						)}
					</div>
				</div>
			</div>
			<div className="p-1 w-full">
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
							{offer.cost_price ? offer.cost_price : 'Set value'}
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
			<div className="p-1 w-full">
				<div className="flex flex-col gap-2">
					<div className="flex lg:gap-0 justify-between">
						<span className="text-gray-600">Autoprice status</span>
						<button
							className={`p-1 px-2 border-2 font-bold text-sm rounded-md ${
								isMinOrMaxPriceNull
									? 'text-white border-red-500 bg-[#00215C]'
									: !offer.autoprice
									? 'text-red-500 border-red-500 bg-[#00215C]'
									: offer.autoprice
									? 'text-green-500 border-green-500 bg-[#00215C]'
									: 'text-red-500 border-red-500 bg-[#00215C]'
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
								: offer.autoprice
								? 'ENABLE'
								: 'DISABLE'}
						</button>
					</div>
					<div className="flex lg:gap-0 justify-between">
						<span className="text-gray-600">Min price</span>
						<p
							className="text-[#00215C] font-bold text-sm underline hover:text-blue-600 cursor-pointer hover:no-underline"
							onClick={() => setIsModalVisible(true)}
						>
							{offer.min_price ? offer.min_price : 'Set value'}
						</p>
						<span className="text-gray-600">Max price</span>
						<p
							className="text-[#00215C] font-bold text-sm underline hover:text-blue-600 cursor-pointer hover:no-underline"
							onClick={() => setIsModalVisible(true)}
						>
							{offer.max_price ? offer.max_price : 'Set value'}
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
						{!isViewChart ? (
							<ChartComponentMyOffers key={offer.id} lineData={chartData} />
						) : (
							<SkeletonChart />
						)}
					</div>
				</div>
			</div>
			<EditOfferModal
				offer_id={offer.id}
				isVisible={isModalVisible}
				onClose={() => setIsModalVisible(false)}
				newCard={newCard}
			/>
		</div>
	);
});
