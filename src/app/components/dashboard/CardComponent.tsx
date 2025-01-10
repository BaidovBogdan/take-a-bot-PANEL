import { Dropdown } from 'antd';
import { menuItems } from './menuItems';

export const CardComponent = ({ title, value, details, icon }: any) => {
	return (
		<div className="bg-white shadow-md rounded-lg p-4 flex flex-col gap-4">
			<div className="flex justify-between items-start">
				<div className="flex flex-col gap-1">
					<p className="text-gray-500 font-bold">{title}</p>
					<p className="text-[#012970] font-bold text-2xl">{value}</p>
					<p className="text-[#7D879C] text-sm">{details}</p>
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
			<div className="flex items-center gap-3">
				<div className="bg-[#E7F8EF] rounded-full p-2 flex items-center justify-center text-green-600">
					<span className="text-3xl">{icon}</span>
				</div>
				<span className="text-[#22C55E] text-xl">↑</span>
			</div>
		</div>
	);
};
