'use client';

import { Line } from '@ant-design/plots';
import { Dropdown } from 'antd';
import { menuItems } from './menuItems';
import { useEffect, useState, useRef } from 'react';

export const ChartComponent = () => {
	const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		window.addEventListener('resize', handleResize);
		handleResize();

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	useEffect(() => {
		if (canvasRef.current) {
			const canvasWidth = canvasRef.current.width;
			console.log('Canvas width:', canvasWidth);
		}
	}, [windowWidth]);

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
		legend: { size: false },
		colorField: 'category',
	};

	return (
		<>
			<div className="flex flex-col gap-2 bg-white shadow-md rounded-lg p-4">
				<div className="flex justify-between">
					<div>
						<span className="text-[#899bbd] text-sm">
							<b className="text-xl text-[#012970] ">Sales </b>| All
						</span>
					</div>
					<Dropdown
						menu={{ items: menuItems }}
						placement="bottomLeft"
						trigger={['click']}
						arrow
					>
						<button className="text-gray-500 text-sm hover:text-gray-800">
							•••
						</button>
					</Dropdown>
				</div>
				<Line {...config} />
			</div>
		</>
	);
};
