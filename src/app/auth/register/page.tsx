'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Skeleton, message } from 'antd';
import Image from 'next/image';
import axios from 'axios';

interface RegisterFormProps {
	email: string;
	password: string;
	confirm: string;
	username: string;
	is_active: boolean;
	is_superuser: boolean;
	is_verified: boolean;
}

const RegisterForm = () => {
	const [loading, setLoading] = useState<boolean>(true);
	const [isRegsiter, setIsRegister] = useState<boolean>(false);

	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 1000);
	}, []);

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen bg-gray-100">
				<div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 space-y-8">
					<div className="text-center flex flex-col gap-4">
						<Skeleton.Input active className="w-64 mx-auto mb-4 h-10" />
						<Skeleton.Input active className="w-64 mx-auto mb-4 h-10" />
						<Skeleton.Input active className="w-64 mx-auto mb-4 h-10" />
						<Skeleton.Input active className="w-64 mx-auto mb-4 h-10" />
						<Skeleton.Input active className="w-80 mx-auto mb-4 h-10" />
						<Skeleton.Input active className="w-80 mx-auto mb-4 h-10" />
						<Skeleton.Input active className="w-80 mx-auto mb-4 h-10" />
						<Skeleton.Input active className="w-80 mx-auto mb-4 h-10" />
					</div>
				</div>
			</div>
		);
	}

	const handleRegister = async (values: RegisterFormProps) => {
		setIsRegister(true);
		try {
			const response = await axios.post(
				'http://13.246.12.216/auth/register',
				{
					email: values.email,
					password: values.password,
					confirm_password: values.confirm,
					username: values.username,
					is_active: true,
					is_superuser: false,
					is_verified: false,
				},
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			message.success('Registration successful!');
			console.log('Response:', response.data);
		} catch (error: unknown) {
			if (axios.isAxiosError(error)) {
				console.error('Error:', error.response?.data || error.message);
				message.error(
					error.response?.data?.detail[0]?.msg ||
						error.response?.data?.detail?.reason
				);
			} else {
				console.error('Unexpected error:', error);
				message.error('An unexpected error occurred!');
			}
		} finally {
			setIsRegister(false);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
				<div className="text-center mb-6">
					<Image
						width={200}
						height={200}
						src="/takeabotLOGO.png"
						layout="intrinsic"
						alt="Logo"
						className="mx-auto mb-14"
						priority
					/>
					<h2 className="text-xl font-bold mt-4 text-blue-900">
						Create an Account
					</h2>
					<p className="text-gray-500">
						Enter your personal details to create account
					</p>
				</div>
				<Form
					name="register"
					onFinish={handleRegister}
					initialValues={{ remember: true }}
					className="space-y-4"
				>
					<Form.Item
						name="username"
						rules={[{ required: true, message: 'Please input your username!' }]}
					>
						<Input
							prefix={<span>@</span>}
							placeholder="Enter your username"
							autoComplete="username"
							className="h-10"
						/>
					</Form.Item>

					<Form.Item
						name="email"
						rules={[
							{ required: true, message: 'Please input your email!' },
							{ type: 'email', message: 'Please enter a valid email address!' },
						]}
					>
						<Input
							placeholder="Enter your email"
							className="h-10"
							autoComplete="email"
						/>
					</Form.Item>

					<Form.Item
						name="password"
						rules={[{ required: true, message: 'Please input your password!' }]}
					>
						<Input.Password
							placeholder="Enter your password"
							className="h-10"
						/>
					</Form.Item>

					<Form.Item
						name="confirm"
						dependencies={['password']}
						rules={[
							{ required: true, message: 'Please confirm your password!' },
							({ getFieldValue }) => ({
								validator(_, value) {
									if (!value || getFieldValue('password') === value) {
										return Promise.resolve();
									}
									return Promise.reject(
										new Error('The two passwords do not match!')
									);
								},
							}),
						]}
					>
						<Input.Password
							placeholder="Confirm your password"
							className="h-10"
						/>
					</Form.Item>

					<Form.Item name="rules" valuePropName="checked">
						<Checkbox>
							After thorough consideration of the Terms of service and Privacy
							policy, I confirm my acceptance
						</Checkbox>
					</Form.Item>

					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							className="w-full h-10 bg-blue-500 hover:bg-blue-600"
							loading={isRegsiter}
						>
							Register
						</Button>
					</Form.Item>
				</Form>

				<div className="text-center text-sm text-gray-500 mt-4">
					<p className="text-left">
						Already have an account?{' '}
						<a href="/auth/login" className="text-blue-500 hover:underline">
							Log in
						</a>
					</p>
				</div>
				<p className="text-center text-xs text-gray-400 mt-6">
					Created by{' '}
					<a
						href="https://takeabot.com"
						className="text-blue-500 hover:underline"
					>
						TakeaBot
					</a>
				</p>
			</div>
		</div>
	);
};

export default RegisterForm;
