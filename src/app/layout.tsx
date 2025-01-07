'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { Sidebar } from './components/sidebar/Sidebar';
import { Header } from './components/header/Header';
import { Footer } from './components/footer/Footer';
import { useAtom } from 'jotai';
import { burgerCheckAtom } from './atoms/atoms';
import '@ant-design/v5-patch-for-react-19';
import './globals.css';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [burgerCheckA] = useAtom(burgerCheckAtom);
	const pathname = usePathname();
	const showSidebar =
		pathname !== '/auth/login' &&
		pathname !== '/auth/register' &&
		pathname !== '/auth/reset-password' &&
		pathname !== '/auth/reset-password/done';

	const hideHeaderAndFooter =
		pathname === '/auth/login' ||
		pathname === '/auth/register' ||
		pathname === '/auth/reset-password' ||
		pathname === '/auth/reset-password/done';

	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col p-4`}
			>
				{!hideHeaderAndFooter && <Header />}
				<div className="flex flex-1 overflow-hidden">
					{showSidebar && <Sidebar visible={burgerCheckA} className="w-64" />}
					<main
						className={`flex-1 transition-all duration-250 ${
							burgerCheckA ? 'ml-0' : 'ml-[-256px]'
						}`}
					>
						{children}
					</main>
				</div>
				{!hideHeaderAndFooter && (
					<div className="flex justify-center">
						<Footer />
					</div>
				)}
			</body>
		</html>
	);
}
