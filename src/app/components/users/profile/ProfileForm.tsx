import { Button, Form, Input, Avatar, Upload } from 'antd';
import { useState } from 'react';

export const ProfileForm = () => {
	const [imageUrl, setImageUrl] = useState<string>(
		'https://cdn-icons-png.flaticon.com/512/847/847969.png' // Стандартное изображение
	);

	const uploadProps = {
		beforeUpload: (file: File) => {
			const isImage =
				file.type === 'image/jpeg' ||
				file.type === 'image/png' ||
				file.type === 'image/gif';
			if (!isImage) {
				alert('You can only upload image files (JPEG/PNG/GIF)');
			}
			return isImage || Upload.LIST_IGNORE;
		},
		showUploadList: false,
		customRequest: ({ file, onSuccess }: any) => {
			// Эмуляция загрузки
			setTimeout(() => {
				setImageUrl(URL.createObjectURL(file)); // Установка URL для аватара
				onSuccess('ok');
			}, 1000);
		},
	};

	return (
		<div className="flex justify-center bg-white rounded-lg p-4">
			<Form
				layout="horizontal"
				labelAlign="left"
				onFinish={(values) => console.log('Form submitted:', values)}
				className="bg-white p-4 rounded shadow w-full max-w-md"
			>
				<Form.Item
					label={<span className="text-lg text-[#012970]">Profile Image</span>}
					name="profileImage"
					labelCol={{ span: 12 }}
					wrapperCol={{ span: 20 }}
				>
					<div className="flex justify-center">
						<Upload {...uploadProps}>
							<div className="relative w-32 h-32 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center">
								<Avatar
									size={128}
									src={imageUrl}
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
					name="firstName"
					labelCol={{ span: 12 }}
					wrapperCol={{ span: 20 }}
					rules={[{ message: 'Please enter your first name' }]}
				>
					<Input placeholder="Enter your first name" className="rounded" />
				</Form.Item>

				<Form.Item
					label={<span className="text-lg text-[#012970]">Last Name</span>}
					name="lastName"
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
