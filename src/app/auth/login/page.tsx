'use client';

import React, { useState, useEffect } from 'react';
import qs from 'qs';
import { Form, Input, Button, Checkbox, Skeleton, message } from 'antd';
import Image from 'next/image';
import axios from 'axios';
import { BASE_URL } from '../../api/api';

interface LoginFormProps {
	password: string;
	username: string;
}

const LoginForm = () => {
	const [loading, setLoading] = useState(true);
	const [isLogin, setIsLogin] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 1000);
	}, []);

	const handleLogin = async (values: LoginFormProps) => {
		console.log('Login values:', values.password + ' ' + values.username);
		setIsLogin(true);
		try {
			const response = await axios.post(
				`${BASE_URL}/auth/jwt/login`,
				qs.stringify({
					username: values.username,
					password: values.password,
				})
			);
			message.success('Login successful!');
			console.log('Response:', response.data);
		} catch (error: unknown) {
			if (axios.isAxiosError(error)) {
				console.error('Error:', error.response?.data || error.message);
				message.error(
					error.response?.data?.detail[0]?.msg ||
						error.response?.data?.detail?.reason ||
						error.response?.data?.detail
				);
			} else {
				console.error('Unexpected error:', error);
				message.error('An unexpected error occurred!');
			}
		} finally {
			setIsLogin(false);
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen bg-gray-100">
				<div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 space-y-8">
					<div className="text-center flex flex-col gap-5">
						<Skeleton.Input active className="w-64 mx-auto mb-4 h-10" />
						<Skeleton.Input active className="w-64 mx-auto mb-4 h-10" />
						<Skeleton.Input active className="w-64 mx-auto mb-4 h-10" />
						<Skeleton.Input active className="w-64 mx-auto mb-4 h-10" />
						<Skeleton.Input active className="w-80 mx-auto mb-4 h-10" />
						<Skeleton.Input active className="w-80 mx-auto mb-4 h-10" />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
				<div className="text-center mb-6">
					<Image
						width={200}
						height={200}
						src="/takeabotLOGO.png"
						layout="intrinsic"
						priority
						alt="Logo"
						className="mx-auto mb-14"
					/>
					<h2 className="text-xl font-bold mt-4 text-blue-900">
						Login to Your Account
					</h2>
					<p className="text-gray-500">
						Enter your username &amp; password to login
					</p>
				</div>
				<Form
					name="login"
					initialValues={{ remember: true }}
					onFinish={handleLogin}
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
						name="password"
						rules={[{ required: true, message: 'Please input your password!' }]}
					>
						<Input.Password
							placeholder="Enter your password"
							className="h-10"
						/>
					</Form.Item>

					<Form.Item name="rules" valuePropName="checked">
						<Checkbox>Remember me</Checkbox>
					</Form.Item>

					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							className="w-full h-10 bg-blue-500 hover:bg-blue-600"
							loading={isLogin}
							block
						>
							Login
						</Button>
					</Form.Item>
				</Form>

				<div className="text-center text-sm text-gray-500 mt-4">
					<p className="text-left">
						Don&apos;t have an account?{' '}
						<a href="/auth/register" className="text-blue-500 hover:underline">
							Create an account
						</a>
					</p>
					<br />
					<p className="text-left">
						Forgot your password?{' '}
						<a
							href="/auth/reset-password"
							className="text-blue-500 hover:underline"
						>
							Password reset
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

export default LoginForm;
