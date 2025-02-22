'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Skeleton } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useVerify } from '@/app/api/api';

const IsVerified = () => {
	const [loading, setLoading] = useState(true);
	const { requestVerifyCode } = useVerify();
	const router = useRouter();
	const [code, setCode] = useState<string | number>('');

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
						<Skeleton.Input active className="w-80 mx-auto mb-4 h-10" />
						<Skeleton.Input active className="w-80 mx-auto mb-4 h-10" />
					</div>
				</div>
			</div>
		);
	}

	const onFinish = () => {
		requestVerifyCode(+code);
		router.push('/auth/login');
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
						priority
						alt="Logo"
						className="mx-auto mb-14"
					/>
					<h2 className="text-xl font-bold mt-4 text-blue-900">
						Verify your account
					</h2>
					<p className="text-gray-500">Enter the code sent to your email</p>
				</div>
				<br />
				<Form
					name="verify"
					initialValues={{ remember: true }}
					className="space-y-4"
				>
					<Form.Item
						name="username"
						rules={[{ required: true, message: 'Please input your code!' }]}
					>
						<div className="flex items-center">
							<Input
								placeholder="Enter your code from email"
								autoComplete="code"
								className="h-10"
								value={code}
								onChange={(e) => setCode(e.target.value)}
							/>
							<Button className="h-10" onClick={onFinish}>
								<SendOutlined />
							</Button>
						</div>
					</Form.Item>
					<br />
					<br />
					<br />
				</Form>

				<p className="text-center text-xs text-gray-400">
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

export default IsVerified;
