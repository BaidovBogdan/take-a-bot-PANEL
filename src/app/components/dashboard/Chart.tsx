import { Line } from '@ant-design/plots';
import { Dropdown, Skeleton } from 'antd';
import { DashboardI } from '@/app/atoms/atoms';
import React from 'react';

interface Dashboard {
	dashboard: DashboardI;
	handleChartFilter: (filter: string) => void;
}

type MenuItem =
	| { key: string; label: string; type?: undefined; onClick: () => void }
	| { type: 'divider'; key?: undefined; label?: undefined };

export const ChartComponent = React.memo(
	({ dashboard, handleChartFilter }: Dashboard) => {
		const menuItems: MenuItem[] = [
			{
				key: 'today',
				label: 'Today',
				onClick: () => handleChartFilter('today'),
			},
			{
				key: 'thisWeek',
				label: 'This Week',
				onClick: () => handleChartFilter('this-week'),
			},
			{
				key: 'thisMonth',
				label: 'This Month',
				onClick: () => handleChartFilter('this-month'),
			},
			{
				key: 'thisYear',
				label: 'This Year',
				onClick: () => handleChartFilter('this-year'),
			},
			{ type: 'divider' },
			{
				key: 'last7Days',
				label: 'Last 7 Days',
				onClick: () => handleChartFilter('last-7-days'),
			},
			{
				key: 'last90Days',
				label: 'Last 90 Days',
				onClick: () => handleChartFilter('last-90-days'),
			},
			{ key: 'all', label: 'All', onClick: () => handleChartFilter('all') },
			{ type: 'divider' },
		];
		const config = {
			data: dashboard.chart_data,
			xField: (d: { year: Date }) => new Date(d.year),
			yField: 'value',
			sizeField: 'value',
			shapeField: 'trail',
			legend: { size: false },
			colorField: 'category',
			animate: { enter: { type: 'scaleInY' } },
		};

		const isLoaded = dashboard && Object.keys(dashboard).length > 1;

		return (
			<>
				<div className="flex flex-col gap-2 bg-white shadow-md rounded-lg p-4">
					<div className="flex justify-between">
						<div>
							<div className="text-[#899bbd] text-sm">
								<b className="text-xl text-[#012970] ">Sales </b>|{' '}
								{isLoaded ? (
									dashboard.chart_filter_label
								) : (
									<Skeleton.Input active size="small" />
								)}
							</div>
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
					{isLoaded ? (
						<Line {...config} />
					) : (
						<Skeleton.Node active style={{ width: '100%', height: '400px' }} />
					)}
				</div>
			</>
		);
	}
);
