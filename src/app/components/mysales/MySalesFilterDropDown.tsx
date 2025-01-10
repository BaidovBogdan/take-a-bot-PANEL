import React, { useState } from 'react';
import { Checkbox, DatePicker, Button, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

type Filters = {
	returned: boolean;
	cancellations: boolean;
	dateRange: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null;
	dc: string[];
};

interface FilterMenuProps {
	onApplyFilters: (filters: Filters) => void;
}

export const FilterMenuMySales: React.FC<FilterMenuProps> = ({
	onApplyFilters,
}) => {
	const [filters, setFilters] = useState<Filters>({
		returned: false,
		cancellations: false,
		dateRange: null,
		dc: ['CPT', 'JHB'],
	});

	const handleCheckboxChange = (key: keyof Filters, value: any) => {
		setFilters({ ...filters, [key]: value });
	};

	const handleDateChange = (
		dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
	) => {
		setFilters({ ...filters, dateRange: dates });
	};

	const handleApplyFilters = () => {
		onApplyFilters(filters);
	};

	// Массив с элементами меню
	const items = [
		{
			key: 'dc',
			label: (
				<div className="mb-2">
					<Checkbox.Group
						options={['CPT', 'JHB']}
						value={filters.dc}
						onChange={(checkedValues) =>
							handleCheckboxChange('dc', checkedValues as string[])
						}
					/>
				</div>
			),
		},
		{
			key: 'returned',
			label: (
				<div className="mb-2">
					<Checkbox
						checked={filters.returned}
						onChange={(e) => handleCheckboxChange('returned', e.target.checked)}
					>
						Returned
					</Checkbox>
				</div>
			),
		},
		{
			key: 'cancellations',
			label: (
				<div className="mb-4">
					<Checkbox
						checked={filters.cancellations}
						onChange={(e) =>
							handleCheckboxChange('cancellations', e.target.checked)
						}
					>
						Cancellations
					</Checkbox>
				</div>
			),
		},
		{
			key: 'dateRange',
			label: (
				<div className="mb-4">
					<RangePicker
						style={{ width: '100%' }}
						value={filters.dateRange}
						onChange={handleDateChange}
					/>
				</div>
			),
		},
		{
			key: 'apply',
			label: (
				<Button type="primary" block onClick={handleApplyFilters}>
					Apply Filters
				</Button>
			),
		},
	];

	return (
		<Dropdown menu={{ items }} trigger={['click']} arrow>
			<button className="text-gray-500 hover:text-gray-800">•••</button>
		</Dropdown>
	);
};
