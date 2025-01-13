import { Line } from '@ant-design/plots';
import { ReloadOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { Tag } from 'antd';

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
	return (
		<div className="md:p-6 bg-white shadow-md rounded-lg w-full flex gap-5 h-full flex-col md:flex-row">
			<div className="flex items-center jus p-4">
				<Image src="/cosmetics.jpg" width={500} height={500} alt="product" />
			</div>
			<div className="p-4 w-full">
				<div className="flex flex-col gap-2">
					<b>ZYXC Professional Magic Gel Remover</b>
					<br />
					<div className="flex md:gap-0 justify-between">
						<span className="text-gray-600">My price</span>
						<p className="text-black">R 23232.00</p>
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
						<p className="text-black">5</p>
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
						<span className="text-black">Set value</span>
					</div>
					<div className="flex md:gap-0 justify-between">
						<button className="bg-[#00215C] rounded-lg text-white p-1 w-20">
							<ReloadOutlined />
						</button>{' '}
						<button className="bg-[#00215C] rounded-lg text-white p-1 w-20">
							Edit
						</button>
					</div>
				</div>
			</div>
			<div className="p-4 w-full">
				<div className="flex flex-col gap-2">
					<div className="flex md:gap-0 justify-between">
						<span className="text-gray-600">Autoprice status</span>
						<p className="text-black">DISABLE</p>
					</div>
					<div className="flex md:gap-0 justify-between">
						<span className="text-gray-600">Min price</span>
						<p className="text-black">R 1.00</p>
						<span className="text-gray-600">Max price</span>
						<p className="text-black">R 232323.00</p>
					</div>
					<div className="flex md:gap-0 justify-between">
						<span className="text-gray-600">Weekly sales</span>
						<p className="text-black">None</p>
						<span className="text-gray-600">Monthly sales</span>
						<p className="text-black">4</p>
					</div>
					<div className="flex md:gap-0 justify-between">
						<span className="text-gray-600">Profit</span>
						<p className="text-black">R 41.75</p>
					</div>
					<div>
						<ChartComponentMyOffers />
					</div>
				</div>
			</div>
		</div>
	);
};
