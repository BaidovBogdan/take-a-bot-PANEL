import { Line } from '@ant-design/plots';
import { Dropdown } from 'antd';
import { menuItems } from './menuItems';

export const ChartComponent = () => {
	const config = {
		data: {
			type: 'fetch',
			value:
				'https://gw.alipayobjects.com/os/bmw-prod/55424a73-7cb8-4f79-b60d-3ab627ac5698.json',
		},
		xField: (d) => new Date(d.year),
		yField: 'value',
		sizeField: 'value',
		shapeField: 'trail',
		legend: { size: false },
		colorField: 'category',
	};
	return (
		<>
			<div className="flex flex-col gap-2 bg-white shadow-md rounded-lg p-4">
				<div className="flex justify-between">
					<span className="text-gray-500 font-bold">Sales | All</span>
					<Dropdown
						menu={{ items: menuItems }}
						placement="bottomLeft"
						trigger={['click']}
						arrow
					>
						<button className="text-gray-500 hover:text-gray-800">•••</button>
					</Dropdown>
				</div>
				<Line {...config} />
			</div>
		</>
	);
};
