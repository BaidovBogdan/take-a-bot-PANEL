'use client';
import { Nunito } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { Sidebar } from './components/sidebar/Sidebar';
import { Header } from './components/header/Header';
import { Footer } from './components/footer/Footer';
import { useAtom } from 'jotai';
import { burgerCheckAtom } from './atoms/atoms';
import '@ant-design/v5-patch-for-react-19';
import './globals.css';

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

	console.log('burgerCheckAtom:', burgerCheckA);

	return (
		<html lang="en" className={nunito.variable}>
			<body className="antialiased flex flex-col min-h-screen w-full">
				{!hideHeaderAndFooter && <Header />}
				<div className="flex flex-1 overflow-hidden w-full">
					{showSidebar && (
						<Sidebar
							visible={burgerCheckA}
							className={`w-full md:w-64 ${burgerCheckA ? 'block' : 'hidden'}`}
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
