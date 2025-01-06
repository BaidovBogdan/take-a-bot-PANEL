'use client';

import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Skeleton } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const ResetPassword = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const onFinishFailed = (errorInfo: unknown) => {
    console.log('Failed:', errorInfo);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 space-y-8">
          <div className="text-center">
            <Skeleton.Input active className="w-40 mx-auto mb-4" />
            <Skeleton.Input active className="w-64 mx-auto mb-6" />
            <Skeleton.Input active className="w-64 mx-auto mb-6" />
            <Skeleton.Button active className="w-full h-10 mx-auto mb-6" />
            <div className="flex justify-between">
              <Skeleton.Input active className="w-24 mx-2" />
              <Skeleton.Input active className="w-24 mx-2" />
            </div>
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
          onFinish={() => router.push('/auth/reset-password/done')}
          onFinishFailed={onFinishFailed}
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
