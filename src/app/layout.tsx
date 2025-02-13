'use client';
import { motion } from 'framer-motion';
import { Nunito } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { Sidebar } from './components/sidebar/Sidebar';
import { Header } from './components/header/Header';
import { Footer } from './components/footer/Footer';
import { useAtom } from 'jotai';
import { burgerCheckAtom } from './atoms/atoms';
import '@ant-design/v5-patch-for-react-19';
import './globals.css';
import { useEffect, useState } from 'react';

const nunito = Nunito({
	subsets: ['latin'],
	weight: ['400'],
	variable: '--font-nunito',
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [burgerCheckA, setBurgerCheckA] = useAtom(burgerCheckAtom);
	const [isLargeScreen, setIsLargeScreen] = useState(false);
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

	useEffect(() => {
		const handleResize = () => {
			setIsLargeScreen(window.innerWidth >= 1920);
		};

		const handleScroll = () => {
			if (!isLargeScreen && burgerCheckA) {
				setBurgerCheckA(false);
			}
		};

		handleResize();
		window.addEventListener('resize', handleResize);
		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('scroll', handleScroll);
		};
	}, [burgerCheckA, setBurgerCheckA, isLargeScreen]);

	return (
		<html lang="en" className={nunito.variable}>
			<body className="antialiased flex flex-col min-h-screen w-full">
				{!hideHeaderAndFooter && <Header />}
				<div className="flex flex-1 overflow-hidden w-full">
					{showSidebar && (
						<Sidebar
							visible={burgerCheckA}
							className={`w-full md:w-48 ${burgerCheckA ? 'block' : 'hidden'}`}
						/>
					)}
					<main className="flex-1 transition-all duration-500 ease-in-out w-full">
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
