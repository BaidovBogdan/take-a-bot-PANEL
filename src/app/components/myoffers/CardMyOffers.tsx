import { Line } from '@ant-design/plots';
import { Tag } from 'antd';
import Image from 'next/image';

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
						<span>My price</span>
						<Tag color={'green'}>R 23232.00</Tag>
					</div>
					<div className="flex md:gap-0 justify-between">
						<span>Market price</span>
						<Tag color={'green'}>R 95.00</Tag>
						<span>Competitors:</span>
						<Tag color={'red'}>0</Tag>
					</div>
					<div>
						<ChartComponentMyOffers />
					</div>
				</div>
			</div>
			<div className="p-4 w-full">
				<div className="flex flex-col gap-4">
					<div className="flex md:gap-0 justify-between">
						<span>Total sold unit</span>
						<Tag color={'blue'}>5</Tag>
					</div>
					<div className="flex md:gap-0 justify-between">
						<Tag color={'red'}>0</Tag>
						<Tag color={'red'}>0</Tag>
						<Tag color={'red'}>0</Tag>
					</div>
					<div className="flex md:gap-0 justify-between">
						<span>Revenue</span>
						<Tag color={'green'}>R 570.00</Tag>
					</div>
					<div className="flex md:gap-0 justify-between">
						<span>Total profit</span>
						<Tag color={'green'}>R 250.50</Tag>
					</div>
					<div className="flex md:gap-0 justify-between">
						<span>Avg. price</span>
						<Tag color={'green'}>R 90.50</Tag>
					</div>
					<div className="flex md:gap-0 justify-between">
						<span>Total fee’s</span>
						<Tag color={'green'}>R 319.50</Tag>
					</div>
					<div className="flex md:gap-0 justify-between">
						<span>Cost price</span>
						<span>Set value</span>
					</div>
					<div className="flex md:gap-0 justify-between">
						<button>↺</button> <button>Edit</button>
					</div>
				</div>
			</div>
			<div className="p-4 w-full">
				<div className="flex flex-col gap-4">
					<div className="flex md:gap-0 justify-between">
						<span>Autoprice status</span>
						<Tag color={'red'}>DISABLE</Tag>
					</div>
					<div className="flex md:gap-0 justify-between">
						<span>Min price</span>
						<Tag color={'green'}>R 1.00</Tag>
						<span>Max price</span>
						<Tag color={'green'}>R 232323.00</Tag>
					</div>
					<div className="flex md:gap-0 justify-between">
						<span>Weekly sales</span>
						<Tag color={'red'}>None</Tag>
						<span>Monthly sales</span>
						<Tag color={'blue'}>4</Tag>
					</div>
					<div className="flex md:gap-0 justify-between">
						<span>Profit</span>
						<Tag color={'green'}>R 41.75</Tag>
					</div>
					<div>
						<ChartComponentMyOffers />
					</div>
				</div>
			</div>
		</div>
	);
};
