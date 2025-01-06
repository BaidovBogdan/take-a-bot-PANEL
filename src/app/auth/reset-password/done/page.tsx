'use client';

import React, { useEffect, useState } from 'react';
import { Skeleton } from 'antd';
import Image from 'next/image';

const ResetPasswordDone = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

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
      </div>
    </div>
  );
};

export default ResetPasswordDone;
