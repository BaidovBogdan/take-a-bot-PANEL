import { Skeleton } from 'antd';
import { CardStores } from './Card';

export const createTabItems = (loading: boolean) => [
	{
		key: '1',
		label: 'Personal info',
		children: loading ? (
			<Skeleton active />
		) : (
			<p>Personal information content goes here.</p>
		),
	},
	{
		key: '2',
		label: 'Stores info',
		children: loading ? <Skeleton active /> : <CardStores />,
	},
	{
		key: '3',
		label: 'Billing Info',
		children: loading ? (
			<Skeleton active />
		) : (
			<p>Billing information content goes here.</p>
		),
	},
	{
		key: '4',
		label: 'Change Password',
		children: loading ? (
			<Skeleton active />
		) : (
			<p>Change password content goes here.</p>
		),
	},
];
