import { Dropdown } from 'antd';
import { RiseOutlined } from '@ant-design/icons';
import { menuItems } from './menuItems';

interface CardComponentProps {
	title: string;
	value: string;
	details: string;
	icon: React.ReactNode;
}

export const CardComponent = ({
	title,
	value,
	details,
	icon,
}: CardComponentProps) => {
	return (
		<div className="bg-white shadow-md rounded-lg p-4 flex flex-col gap-4">
			<div className="flex justify-between items-start">
				<div className="flex flex-col gap-1">
					<p className="text-gray-500 font-bold">{title}</p>
				</div>
				<Dropdown
					menu={{ items: menuItems }}
					placement="bottomRight"
					trigger={['click']}
					arrow
				>
					<button className="text-[#7D879C] text-lg hover:text-gray-800">
						•••
					</button>
				</Dropdown>
			</div>
			<div className="flex justify-between items-center gap-3">
				<div className="flex gap-4">
					<div className="rounded-full p-2 flex items-center justify-center">
						<span className="text-4xl">{icon}</span>
					</div>
					<div>
						<p className="text-[#012970] font-bold text-2xl">{value}</p>
						<p className="text-[#7D879C] text-sm">{details}</p>
					</div>
				</div>
				<div className="text-[#22C55E] text-4xl mr-10">
					<RiseOutlined />
				</div>
			</div>
		</div>
	);
};
