'use client';
import { Nunito } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { Sidebar } from './components/sidebar/Sidebar';
import { Header } from './components/header/Header';
import { Footer } from './components/footer/Footer';
import '@ant-design/v5-patch-for-react-19';
import './globals.css';
import { Layout } from 'antd';

const { Content } = Layout;

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
	const pathname = usePathname();

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
				{!hideHeaderAndFooter && <Header />}
				<Layout className="min-h-screen">
					{showSidebar && <Sidebar />}
					<Layout>
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
