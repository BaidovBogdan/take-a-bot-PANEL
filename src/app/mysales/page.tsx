'use client';

import { Input, Button, Spin, message } from 'antd';
import { HomeOutlined, UndoOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FilterMenuMySales } from '../components/mysales/MySalesFilterDropDown';
import { useAtom } from 'jotai';
import { mySalesData } from '../atoms/atoms';
import { useSales } from '../api/useSales';
import { SalesTable } from '../components/mysales/TableSales';
import React from 'react';
import debounce from 'lodash.debounce';

export default function MySales() {
	const [isUpdatedSales, setIsUpdatedSales] = useState(false);
	const [salesData, setSalesData] = useAtom(mySalesData);
	const wsRef = useRef<WebSocket | null>(null);
	const { updateSales } = useSales();
	const [page, setPage] = useState(1);
	const token = JSON.parse(localStorage.getItem('access_token')!);
	const [searchTerm, setSearchTerm] = useState('');
	const [filterNew, setFilters] = useState<any | null | undefined>({});

	const wsGetSales = debounce(
		(page: number, search?: string, filters?: any) => {
			if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
				const payload: Record<string, any> = {
					action: 'auth',
					token: token,
					page: page,
					paginate_by: 20,
					...filters,
				};

				if (search && search.trim() !== '') {
					payload.search = search;
				}

				wsRef.current.send(JSON.stringify(payload));
			}
		},
		1000,
		{ leading: true, trailing: false }
	);

	useEffect(() => {
		setSalesData([]);
		wsRef.current = new WebSocket('ws://34.44.207.107/api/v1/ws/sales');

		wsRef.current.onopen = () => {
			console.log('WebSocket соединение установлено');
			wsGetSales(page);
		};
		wsRef.current.onmessage = (event) => {
			const data = JSON.parse(event.data);
			const fullData = JSON.parse(data);
			if (Array.isArray(fullData.recent_sales)) {
				setSalesData((prev) => [...prev, ...fullData.recent_sales]);
			} else {
				console.error(
					'recent_sales не является массивом:',
					fullData.recent_sales
				);
			}
			fullData.recent_sales.length < 1
				? message.error('Sales not found')
				: null;
		};

		wsRef.current.onerror = (error) => {
			console.error('WebSocket ошибка:', error);
		};

		wsRef.current.onclose = () => {
			console.log('WebSocket соединение закрыто');
		};

		return () => {
			if (wsRef.current) {
				wsRef.current.close();
			}
		};
	}, []);

	const handleLoadMore = () => {
		setPage((prevPage) => {
			const nextPage = prevPage + 1;
			wsGetSales(nextPage, searchTerm, filterNew);
			return nextPage;
		});
	};

	const debouncedSearch = useCallback(
		debounce((value: string, filters: any) => {
			setPage(1);
			setSalesData([]);
			wsGetSales(1, value, filters);
		}, 1000),
		[filterNew]
	);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchTerm(value);
		debouncedSearch(value, filterNew);
	};

	const handleUpdateSales = async () => {
		setIsUpdatedSales(true);
		try {
			await updateSales();
		} catch (error) {
			console.error('Ошибка обновления цен:', error);
		} finally {
			setIsUpdatedSales(false);
			message.success('Sales updated successfully');
		}
	};

	const applyFilters = (filters: any) => {
		setFilters(filters);
		setPage(1);
		setSalesData([]);
		wsGetSales(1, searchTerm, filters);
	};

	const isLoaded = salesData && Object.keys(salesData).length > 0;

	return (
		<div className="p-4">
			<div className="p-4">
				<div className="flex-col md:flex-row flex gap-5 md:justify-between">
					<div>
						<span className="font-bold text-xl text-[#012970]">My Sales</span>
						<br />
						<div className="text-xs text-gray-700 p-4 flex gap-1">
							<div className="flex items-center">
								<HomeOutlined />
							</div>{' '}
							/ My Sales
						</div>
					</div>
					<Button
						type="primary"
						className={`custom-btn bg-[#00215C] h-10 w-64 md:w-auto transition-colors duration-300 ${
							isUpdatedSales ? 'loading' : ''
						}`}
						icon={<UndoOutlined />}
						iconPosition="start"
						onClick={handleUpdateSales}
						loading={isUpdatedSales}
					>
						Update Sales
					</Button>
				</div>
			</div>
			<div className="bg-white shadow-md rounded-lg min-h-[300px]">
				<div className="flex justify-between p-4">
					<span className="text-[#899bbd] text-sm">
						<b className="text-xl text-[#012970] ">Filters </b>|{' '}
						{filterNew.rec_filter?.length > 0 ? filterNew.rec_filter : 'All'}
					</span>
					<FilterMenuMySales
						onApplyFilters={(filters) => applyFilters(filters)}
					/>
				</div>

				<div className="flex flex-col gap-4 md:flex-row md:justify-center md:gap-0 items-center p-2 mb-4">
					<Input
						placeholder="Search"
						value={searchTerm}
						onChange={handleSearch}
						style={{ width: 200 }}
					/>
				</div>
				{isLoaded ? (
					<SalesTable salesData={salesData} loadMore={handleLoadMore} />
				) : (
					<div className="flex justify-center items-center">
						<Spin />
					</div>
				)}
			</div>
		</div>
	);
}
