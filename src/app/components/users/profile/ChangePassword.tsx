import { Button, Form, Input } from 'antd';

export const ChangePassword = () => {
	function onFinish(values: any): void {
		throw new Error('Function not implemented.');
	}

	return (
		<div className="flex justify-center">
			<Form
				layout="horizontal"
				labelAlign="left"
				onFinish={onFinish}
				className="bg-white shadow-md rounded-lg p-4 md:w-1/2"
			>
				<Form.Item
					label={
						<span className="text-lg text-[#012970]">Current Password</span>
					}
					name="currentPassword"
					rules={[{ message: 'Please enter your current password' }]}
					labelCol={{ span: 9 }}
					wrapperCol={{ span: 16 }}
				>
					<Input.Password
						placeholder="Enter your current password"
						className="rounded w-full"
					/>
				</Form.Item>

				<Form.Item
					label={<span className="text-lg text-[#012970]">New Password</span>}
					name="newPassword"
					rules={[
						{ message: 'Please enter your new password' },
						{ min: 6, message: 'Password must be at least 6 characters long' },
					]}
					labelCol={{ span: 9 }}
					wrapperCol={{ span: 16 }}
				>
					<Input.Password
						placeholder="Enter your new password"
						className="rounded w-full"
					/>
				</Form.Item>

				<Form.Item
					label={
						<span className="text-lg text-[#012970]">
							Re-enter New Password
						</span>
					}
					name="confirmPassword"
					dependencies={['newPassword']}
					rules={[
						{ message: 'Please confirm your new password' },
						({ getFieldValue }) => ({
							validator(_, value) {
								if (!value || getFieldValue('newPassword') === value) {
									return Promise.resolve();
								}
								return Promise.reject(new Error('Passwords do not match'));
							},
						}),
					]}
					labelCol={{ span: 9 }}
					wrapperCol={{ span: 16 }}
				>
					<Input.Password
						placeholder="Re-enter your new password"
						className="rounded w-full"
					/>
				</Form.Item>

				<Form.Item className="flex justify-end p-4">
					<Button type="primary" className="bg-blue-500 w-full md:w-auto">
						Save Changes
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};
