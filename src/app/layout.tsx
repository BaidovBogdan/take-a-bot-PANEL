'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { Sidebar } from './components/sidebar/Sidebar';
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
  const pathname = usePathname();
  const showSidebar =
    pathname !== '/auth/login' &&
    pathname !== '/auth/register' &&
    pathname !== '/auth/reset-password' &&
    pathname !== '/auth/reset-password/done';

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex`}
      >
        {showSidebar && <Sidebar />}
        <main className={`flex-1 ${showSidebar ? '' : 'w-full'}`}>
          {children}
        </main>
      </body>
    </html>
  );
}
