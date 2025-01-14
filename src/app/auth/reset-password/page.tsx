'use client';

import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Skeleton, message } from 'antd';
import Image from 'next/image';
import { forgotPassword } from '../../api/api';
import { useRouter } from 'next/navigation';

const ResetPassword = () => {
	const [loading, setLoading] = useState(true);
	const [isReset, setIsReset] = useState(false);
	const router = useRouter();

	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 1000);
	}, []);

	const onFinish = async (values: { email: string }) => {
		try {
			await forgotPassword({ email: values.email });
			message.success('Password reset email has been sent!');
			router.push('/auth/reset-password/done');
		} catch (error: unknown) {
			console.error('Error:', error);
			message.error(
				error instanceof Error ? error.message : 'An unexpected error occurred.'
			);
		} finally {
			setIsReset(false);
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen bg-gray-100">
				<div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 space-y-8">
					<div className="text-center flex flex-col gap-4">
						<Skeleton.Input active className="w-64 mx-auto mb-4 h-10" />
						<Skeleton.Input active className="w-64 mx-auto mb-4 h-10" />
						<Skeleton.Input active className="w-64 mx-auto mb-4 h-10" />
						<Skeleton.Input active className="w-64 mx-auto mb-4 h-10" />
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
						alt="Logo"
						className="mx-auto mb-14"
						priority
					/>
					<h2 className="text-xl font-bold mt-4 text-blue-900">
						Password reset
					</h2>
					<p className="text-gray-500">
						Enter your email, and we will send you an email with further
						instructions
					</p>
				</div>
				<Form
					name="resetPassword"
					initialValues={{ remember: true }}
					onFinish={onFinish}
					className="space-y-4"
				>
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

					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							className="w-full h-10 bg-blue-500 hover:bg-blue-600"
							loading={isReset}
							block
						>
							Send
						</Button>
					</Form.Item>
				</Form>
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

export default ResetPassword;
