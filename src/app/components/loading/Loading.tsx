'use client';

import { Spin } from 'antd';
import { useState, useEffect } from 'react';

const LoadingSpinner = () => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setLoading(false);
		}, 1000);

		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="flex justify-center items-center h-screen">
			<Spin spinning={loading} size="large" />
		</div>
	);
};

export default LoadingSpinner;
