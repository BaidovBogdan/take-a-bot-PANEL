'use client';
import { useResetPassword } from '@/app/api/api';
import React, { useEffect, useState } from 'react';
import { Button, Form, Skeleton, message, Input } from 'antd';
import Image from 'next/image';

const ResetPasswordDone = () => {
	const { resetPassword } = useResetPassword();
	const [loading, setLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
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
						<Skeleton.Input active className="w-64 mx-auto mb-4 h-10" />
						<Skeleton.Input active className="w-64 mx-auto mb-4 h-10" />
					</div>
				</div>
			</div>
		);
	}

	const onFinish = async (values: { code: string; password: string }) => {
		setIsSubmitting(true);
		const { code, password } = values;
		try {
			await resetPassword(code, password);
		} catch (error: unknown) {
			console.error('Error:', error);
			message.error('An error occurred. Please try again.');
		} finally {
			setIsSubmitting(false);
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
					<h2 className="text-3xl font-bold mt-4 text-gray-500">Pass reset</h2>
					<p className="text-gray-500 text-left">
						We’ve emailed you instructions for setting your password, if an
						account exists with the email you entered. You should receive them
						shortly. <br />
						<br /> If you don’t receive an email, please make sure you’ve
						entered the address you registered with, and check your spam folder.
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
				<br />
				<br />
				<div className="flex justify-center items-center bg-gray-100">
					<Form
						onFinish={onFinish}
						layout="vertical"
						className="bg-white shadow-md rounded-lg p-6 w-full max-w-md"
					>
						<Form.Item
							label={<span className="text-lg text-[#012970]">Code</span>}
							name="code"
							rules={[{ required: true, message: 'Please enter your Code' }]}
						>
							<Input placeholder="Enter your Code" className="rounded" />
						</Form.Item>

						<Form.Item
							label={<span className="text-lg text-[#012970]">Password</span>}
							name="password"
							rules={[
								{ required: true, message: 'Please enter your password' },
								{
									min: 6,
									message: 'Password must be at least 6 characters long',
								},
							]}
						>
							<Input.Password
								placeholder="Enter your password"
								className="rounded"
							/>
						</Form.Item>

						<Form.Item>
							<Button
								type="primary"
								htmlType="submit"
								className="w-full"
								loading={isSubmitting}
								block
							>
								Submit
							</Button>
						</Form.Item>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default ResetPasswordDone;
