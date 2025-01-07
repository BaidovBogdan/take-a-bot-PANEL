import { AlignCenterOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { burgerCheckAtom } from '../../atoms/atoms';
import Image from 'next/image';
import { Skeleton } from 'antd'; // Импортируем Skeleton
import { useEffect, useState } from 'react';

export const Header = () => {
	const [, setBurgerCheckA] = useAtom(burgerCheckAtom);
	const router = useRouter();

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => setLoading(false), 1000);
		return () => clearTimeout(timer);
	}, []);

	if (loading) {
		return (
			<header
				className="flex justify-between p-4"
				onContextMenu={(e) => e.preventDefault()}
			>
				<div className="flex gap-1 cursor-pointer">
					<Skeleton.Avatar active size="large" className="w-8 h-8" />
					<Skeleton.Input active size="small" className="w-32 h-8" />
				</div>
				<div className="flex gap-1 cursor-pointer">
					<Skeleton.Avatar active size="large" className="w-12 h-12" />
					<Skeleton.Input active size="small" className="w-24 h-8" />
				</div>
			</header>
		);
	}

	return (
		<header
			className="flex justify-between p-4"
			onContextMenu={(e) => e.preventDefault()}
		>
			<div className="flex gap-1 cursor-pointer">
				<AlignCenterOutlined
					className="text-2xl"
					onClick={() => setBurgerCheckA((prev: boolean) => !prev)}
				/>
				<Image
					src={'/takeabotLOGO.png'}
					alt="Logo"
					width={150}
					layout="intrinsic"
					priority
					height={90}
					onClick={() => router.push('/dashboard')}
				/>
			</div>
			<div className="flex gap-1 cursor-pointer">
				<Image
					src={'/profileTest.png'}
					className="rounded-full"
					alt="Avatar"
					width={50}
					layout="intrinsic"
					priority
					height={50}
				/>
				<span className="flex items-center">ИМЯ ▼</span>
			</div>
		</header>
	);
};
