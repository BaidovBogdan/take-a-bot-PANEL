import { Button, Skeleton } from 'antd';
import { CardStores } from './Card';
import { ChangePassword } from './ChangePassword';
import { ProfileForm } from './ProfileForm';

const BillingInfo = () => {
	return (
		<div className="flex justify-center p-4">
			<Button type="primary" className="bg-blue-500 w-full md:w-auto">
				Save Changes
			</Button>
		</div>
	);
};

export const createTabItems = (loading: boolean) => [
	{
		key: '1',
		label: 'Personal info',
		children: loading ? <Skeleton active /> : <ProfileForm />,
	},
	{
		key: '2',
		label: 'Stores info',
		children: loading ? <Skeleton active /> : <CardStores />,
	},
	{
		key: '3',
		label: 'Billing Info',
		children: loading ? <Skeleton active /> : <BillingInfo />,
	},
	{
		key: '4',
		label: 'Change Password',
		children: loading ? <Skeleton active /> : <ChangePassword />,
	},
];
