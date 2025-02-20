import { Button, Form, Input, Avatar, Upload } from 'antd';

import { useChangeProfile } from '../../../api/useProfile';

interface ProfileI {
	first_name: string;
	last_name: string;
	photo: string;
	phone: string;
}

export const ProfileForm: React.FC = () => {
	const [form] = Form.useForm();
	const { changeProfile } = useChangeProfile();

	const onFinish = (values: ProfileI) => {
		changeProfile(
			values.first_name,
			values.last_name,
			values.photo,
			values.phone
		);

		form.resetFields();
	};

	return (
		<div className="flex justify-center bg-white rounded-lg p-4">
			<Form
				layout="horizontal"
				labelAlign="left"
				form={form}
				onFinish={onFinish}
				className="bg-white p-4 rounded shadow w-full max-w-md"
			>
				<Form.Item
					label={<span className="text-lg text-[#012970]">Profile Image</span>}
					name="photo"
					labelCol={{ span: 12 }}
					wrapperCol={{ span: 20 }}
				>
					<div className="flex justify-center">
						<Upload>
							<div className="relative w-32 h-32 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center">
								<Avatar
									size={128}
									src={'/profileTest.png'}
									className="w-full h-full object-cover"
								/>
								<div className="absolute inset-0 bg-gray-700 bg-opacity-60 flex items-center justify-center text-white font-medium opacity-0 hover:opacity-100 transition-opacity">
									Click to Change
								</div>
							</div>
						</Upload>
					</div>
				</Form.Item>

				<Form.Item
					label={<span className="text-lg text-[#012970]">First Name</span>}
					name="first_name"
					labelCol={{ span: 12 }}
					wrapperCol={{ span: 20 }}
					rules={[{ message: 'Please enter your first name' }]}
				>
					<Input placeholder="Enter your first name" className="rounded" />
				</Form.Item>

				<Form.Item
					label={<span className="text-lg text-[#012970]">Last Name</span>}
					name="last_name"
					labelCol={{ span: 12 }}
					wrapperCol={{ span: 20 }}
					rules={[{ message: 'Please enter your last name' }]}
				>
					<Input placeholder="Enter your last name" className="rounded" />
				</Form.Item>

				<Form.Item
					label={<span className="text-lg text-[#012970]">Phone</span>}
					labelCol={{ span: 12 }}
					wrapperCol={{ span: 20 }}
					name="phone"
					rules={[
						{ message: 'Please enter your phone number' },
						{ pattern: /^\d{10,15}$/, message: 'Enter a valid phone number' },
					]}
				>
					<Input
						autoComplete="none"
						placeholder="Enter your phone number"
						className="rounded"
					/>
				</Form.Item>

				<Form.Item className="flex justify-end">
					<Button
						type="primary"
						htmlType="submit"
						className="bg-blue-500 text-white px-6 py-2 rounded"
					>
						Save Changes
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};
