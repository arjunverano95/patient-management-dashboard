import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import {AntdRegistry} from '@ant-design/nextjs-registry';
import MessageProvider from '../components/providers/MessageProvider';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Patient Management Dashboard',
  description:
    'Advanced patient management system with search, filtering, and real-time updates',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AntdRegistry>
          <MessageProvider>{children}</MessageProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
