'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Skeleton } from 'antd';
import { useAtom } from 'jotai';
import { burgerCheckAtom } from '../../atoms/atoms';
import Image from 'next/image';

const LoginForm = () => {
	const [loading, setLoading] = useState(true);
	const [isBurgerCheckAtom, setIsBurgerCheckAtom] = useAtom(burgerCheckAtom);

	useEffect(() => {
		setIsBurgerCheckAtom(isBurgerCheckAtom ? true : false);
		setTimeout(() => {
			setLoading(false);
		}, 1000);
	}, []);

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
						Enter your username & password to login
					</p>
				</div>
				<Form
					name="login"
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
						>
							Login
						</Button>
					</Form.Item>
				</Form>

				<div className="text-center text-sm text-gray-500 mt-4">
					<p className="text-left">
						Don't have an account?{' '}
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
