import Image from 'next/image';

interface BestsellerCardProps {
	image: string;
	title: string;
	price: number;
	totalPrice: number;
	quantity: number;
}
export const BestsellerCard = ({
	image,
	title,
	price,
	totalPrice,
	quantity,
}: BestsellerCardProps) => {
	return (
		<div className="flex items-center gap-4 bg-white shadow-md rounded-lg p-6">
			<Image
				src={image}
				alt={title}
				width={64}
				height={64}
				className="rounded"
			/>
			<div className="flex-1">
				<p className="font-bold text-gray-800">{title}</p>
				<div className="flex justify-between mt-2">
					<span className="text-gray-600">R {price}</span>
					<span className="text-gray-600">R {totalPrice}</span>
				</div>
			</div>
			<div className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-800 rounded">
				{quantity}
			</div>
		</div>
	);
};
