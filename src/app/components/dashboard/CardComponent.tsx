import { Dropdown, Skeleton } from 'antd';
import { RiseOutlined } from '@ant-design/icons';
import { DashboardData } from '@/app/atoms/atoms';
import { useAtom } from 'jotai';

interface CardComponentProps {
	title: string;
	subTitle: string;
	value: string;
	details: string;
	icon: React.ReactNode;
	filter: string;
	onFilterChange: (filter: string) => void;
}

type MenuItem =
	| { key: string; label: string; type?: undefined; onClick?: () => void }
	| { type: 'divider'; key?: undefined; label?: undefined };

export const CardComponent = ({
	title,
	subTitle,
	value,
	details,
	icon,
	filter,
	onFilterChange,
}: CardComponentProps) => {
	const [dashboard] = useAtom(DashboardData);
	const isLoaded = dashboard && Object.keys(dashboard).length > 1;

	const handleFilterClick = (filter: string) => {
		onFilterChange(filter); // Обновляем фильтр через пропс
	};

	const menuItems: MenuItem[] = [
		{ key: 'today', label: 'Today', onClick: () => handleFilterClick('today') },
		{
			key: 'thisWeek',
			label: 'This Week',
			onClick: () => handleFilterClick('this-week'),
		},
		{
			key: 'thisMonth',
			label: 'This Month',
			onClick: () => handleFilterClick('this-month'),
		},
		{
			key: 'thisYear',
			label: 'This Year',
			onClick: () => handleFilterClick('this-year'),
		},
		{ type: 'divider' },
		{
			key: 'last7Days',
			label: 'Last 7 Days',
			onClick: () => handleFilterClick('last-7-days'),
		},
		{
			key: 'last90Days',
			label: 'Last 90 Days',
			onClick: () => handleFilterClick('last-90-days'),
		},
		{ key: 'all', label: 'All', onClick: () => handleFilterClick('all') },
		{ type: 'divider' },
	];

	return (
		<div className="bg-white shadow-md rounded-lg p-4 flex flex-col gap-4">
			<div className="flex justify-between items-start">
				<div className="flex flex-col gap-1">
					<div>
						<div className="text-[#899bbd] text-sm">
							<b className="text-xl text-[#012970] ">{title}</b>
							{isLoaded && subTitle !== null ? (
								subTitle
							) : (
								<Skeleton.Input active size="small" />
							)}
						</div>
					</div>
				</div>
				<Dropdown
					menu={{ items: menuItems }}
					placement="bottomRight"
					trigger={['click']}
					arrow
				>
					<button className="text-[#7D879C] text-sm hover:text-gray-800">
						•••
					</button>
				</Dropdown>
			</div>
			<div className="flex justify-between items-center gap-3">
				<div className="flex gap-4">
					<div className="rounded-full p-2 flex items-center justify-center">
						<div className="text-4xl">
							{isLoaded && icon !== null ? (
								icon
							) : (
								<Skeleton.Avatar active size="large" />
							)}
						</div>
					</div>
					<div>
						<div className="text-[#012970] font-bold text-2xl">
							{isLoaded && value != null ? (
								value
							) : (
								<Skeleton.Input active size="small" />
							)}
						</div>
						<p
							className="text-[#7D879C] text-sm"
							dangerouslySetInnerHTML={{
								__html: isLoaded ? details : '',
							}}
						></p>
					</div>
				</div>
				<div className="text-[#22C55E] text-4xl mr-10">
					{isLoaded ? (
						<RiseOutlined />
					) : (
						<Skeleton.Avatar active size="large" />
					)}
				</div>
			</div>
		</div>
	);
};
