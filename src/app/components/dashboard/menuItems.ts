type MenuItem =
	| { key: string; label: string; type?: undefined }
	| { type: 'divider'; key?: undefined; label?: undefined };

export const menuItems: MenuItem[] = [
	{ key: 'today', label: 'Today' },
	{ key: 'thisWeek', label: 'This Week' },
	{ key: 'thisMonth', label: 'This Month' },
	{ key: 'thisYear', label: 'This Year' },
	{ type: 'divider' },
	{ key: 'last7Days', label: 'Last 7 Days' },
	{ key: 'last90Days', label: 'Last 90 Days' },
	{ key: 'all', label: 'All' },
	{ type: 'divider' },
];
