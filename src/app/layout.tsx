'use client';
import { Nunito } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { Sidebar } from './components/sidebar/Sidebar';
import { Header } from './components/header/Header';
import { Footer } from './components/footer/Footer';
import '@ant-design/v5-patch-for-react-19';
import './globals.css';
import { Layout } from 'antd';
import { USERS_URL } from './api/api';
import axios from 'axios';
import { useAtom } from 'jotai';
import { accessTokenAtom, refreshTokenAtom } from './atoms/atoms';
import { useEffect } from 'react';

const { Content } = Layout;

const nunito = Nunito({
	subsets: ['latin'],
	weight: ['400'],
	variable: '--font-nunito',
});

const refreshAccessToken = async (
	refreshToken: string | null,
	setAccessToken: Function
) => {
	try {
		const response = await axios.post(
			`${USERS_URL}/api/v1/jwt/refresh`,
			{},
			{
				headers: {
					Authorization: `Bearer ${refreshToken}`,
				},
			}
		);
		setAccessToken(response.data.access_token);
		console.log('Access token refreshed:', response.data.access_token);
	} catch (error) {
		console.error('Error refreshing access token:', error);
	}
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const [, setAccessToken] = useAtom(accessTokenAtom);
	const [refreshToken] = useAtom(refreshTokenAtom);

	useEffect(() => {
		if (typeof window === 'undefined') return;

		if (refreshToken && !authPaths.includes(pathname)) {
			const refreshInterval = setInterval(() => {
				console.log('Refreshing token...');
				refreshAccessToken(refreshToken, setAccessToken);
			}, 14 * 60 * 1000);

			return () => clearInterval(refreshInterval);
		}
	}, [refreshToken, setAccessToken]);

	const authPaths = [
		'/auth/login',
		'/auth/register',
		'/auth/reset-password',
		'/auth/reset-password/done',
		'/auth/is-verified',
	];
	const showSidebar = !authPaths.includes(pathname);
	const hideHeaderAndFooter = authPaths.includes(pathname);

	return (
		<html lang="en" className={nunito.variable}>
			<body>
				<Layout className="min-h-screen">
					{showSidebar && <Sidebar />}
					<Layout>
						{!hideHeaderAndFooter && <Header />}
						<Content className="p-4">{children}</Content>
						{!hideHeaderAndFooter && (
							<div className="flex justify-center items-center flex-col">
								<br />
								<hr className="w-full" />
								<br />
								<Footer />
							</div>
						)}
					</Layout>
				</Layout>
			</body>
		</html>
	);
}
