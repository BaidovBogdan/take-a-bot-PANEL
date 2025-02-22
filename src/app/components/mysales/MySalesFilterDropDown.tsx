'use client';

import React, { useState } from 'react';
import { Checkbox, DatePicker, Button, Dropdown } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { ItemType } from 'antd/es/menu/interface';
const { RangePicker } = DatePicker;

type Filters = {
	rec_filter?: string;
	start_date?: string;
	end_date?: string;
	cpt?: boolean | undefined;
	jhb?: boolean | undefined;
	returned?: boolean | undefined;
	cancellations?: boolean | undefined;
};

interface FilterMenuProps {
	onApplyFilters: (filters: Filters) => void;
}

export const FilterMenuMySales: React.FC<FilterMenuProps> = ({
	onApplyFilters,
}) => {
	const [filters, setFilters] = useState<Filters>({});

	const groupedItems = [
		[
			{ key: 'today', label: 'Today' },
			{ key: 'this-week', label: 'This Week' },
		],
		[
			{ key: 'this-month', label: 'This Month' },
			{ key: 'this-year', label: 'This Year' },
		],
		[
			{ key: 'last-7-days', label: 'Last 7 Days' },
			{ key: 'last-90-days', label: 'Last 90 Days' },
		],
		[{ key: 'all', label: 'All' }],
	];

	const handleCheckboxChange = (
		key: keyof Filters,
		value: boolean | string
	) => {
		setFilters((prev) => {
			const newFilters = { ...prev };

			if (key === 'rec_filter') {
				if (value) {
					newFilters[key] = value as string;
				} else {
					delete newFilters[key];
				}
			} else {
				if (value) {
					//@ts-ignore
					newFilters[key] = value as boolean | undefined | null;
				} else {
					delete newFilters[key];
				}
			}

			return newFilters;
		});
	};

	const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
		setFilters((prev) => ({
			...prev,
			start_date: dates?.[0]?.toISOString(),
			end_date: dates?.[1]?.toISOString(),
		}));
	};

	const handleApplyFilters = () => {
		const cleanedFilters = Object.entries(filters).reduce(
			(acc, [key, value]) => {
				if (value !== false && value !== null && value !== undefined) {
					acc[key] = value;
				}
				return acc;
			},
			{} as Record<string, any>
		);

		onApplyFilters(cleanedFilters);
	};

	const preventDropdownClose = (e: React.MouseEvent) => {
		e.stopPropagation();
	};

	const items: ItemType[] = [
		...groupedItems.map((group, groupIndex) => ({
			key: `group-${groupIndex}`,
			label: (
				<div className="flex" onClick={preventDropdownClose}>
					{group.map(({ key, label }) => (
						<Checkbox
							key={key}
							checked={filters.rec_filter === key}
							onChange={(e) =>
								handleCheckboxChange('rec_filter', e.target.checked ? key : '')
							}
						>
							{label}
						</Checkbox>
					))}
				</div>
			),
		})),
		{ type: 'divider' },
		{
			key: 'dc',
			label: (
				<div className="mb-2 flex flex-col" onClick={preventDropdownClose}>
					<Checkbox
						checked={filters.cpt}
						onChange={(e) => handleCheckboxChange('cpt', e.target.checked)}
					>
						CPT
					</Checkbox>
					<Checkbox
						checked={filters.jhb}
						onChange={(e) => handleCheckboxChange('jhb', e.target.checked)}
					>
						JHB
					</Checkbox>
				</div>
			),
		},
		{ type: 'divider' },
		{
			key: 'returned',
			label: (
				<div className="mb-2" onClick={preventDropdownClose}>
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
				<div className="mb-4" onClick={preventDropdownClose}>
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
		{ type: 'divider' },
		{
			key: 'dateRange',
			label: (
				<div className="mb-4" onClick={preventDropdownClose}>
					<RangePicker
						style={{ width: '100%' }}
						value={[
							filters.start_date ? dayjs(filters.start_date) : null,
							filters.end_date ? dayjs(filters.end_date) : null,
						]}
						onChange={handleDateChange}
					/>
				</div>
			),
		},
		{ type: 'divider' },
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
			<button className="text-[#7D879C] text-sm hover:text-gray-800">
				•••
			</button>
		</Dropdown>
	);
};
