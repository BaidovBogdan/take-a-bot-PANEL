import { DashboardData } from '@/app/atoms/atoms';
import { useAtom } from 'jotai';
import Image from 'next/image';
import { Skeleton } from 'antd';

interface BestsellerCardProps {
	image: string;
	title: string;
	price: number | string;
	totalPrice: number | string;
	quantity: number;
}

export const BestsellerCard = ({
	image,
	title,
	price,
	totalPrice,
	quantity,
}: BestsellerCardProps) => {
	const [dashboard] = useAtom(DashboardData);
	const isLoaded = dashboard && Object.keys(dashboard).length > 1;
	return (
		<>
			<div className="flex items-center gap-4 bg-white shadow-md rounded-lg p-6">
				{isLoaded && image !== null ? (
					<Image
						src={image}
						alt={title}
						width={64}
						height={64}
						className="rounded"
					/>
				) : (
					<Skeleton.Avatar active size="large" />
				)}
				<div className="flex-1">
					<div className="font-bold text-gray-800">
						{isLoaded && title !== null ? (
							title
						) : (
							<Skeleton.Input active size="small" />
						)}
					</div>
					{isLoaded && price !== null ? (
						<div className="flex justify-between mt-2">
							<span className="text-[#6c757d] border w-20 border-[#6c757d] transition rounded px-2 text-center hover:bg-[#6c757d] hover:text-white">
								R {price}
							</span>
							<span className="text-[#6c757d] border w-20 border-[#6c757d] transition rounded px-2 text-center hover:bg-[#6c757d] hover:text-white">
								R {totalPrice}
							</span>
						</div>
					) : (
						<Skeleton.Input active size="small" />
					)}
				</div>
				<div className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-800 rounded">
					{isLoaded && quantity !== null ? (
						quantity
					) : (
						<Skeleton.Avatar active size="small" />
					)}
				</div>
			</div>
		</>
	);
};
