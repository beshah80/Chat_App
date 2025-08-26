import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import { SocketProvider } from '../contexts/SocketContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ChatApp - Modern Real-time Messaging',
  description: 'Connect with people worldwide through our modern chat platform. Real-time messaging, global chat rooms, and private conversations.',
  keywords: 'chat, messaging, real-time, communication, social',
  authors: [{ name: 'ChatApp Team' }],
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <SocketProvider>
            <div id="root" className="min-h-screen">
              {children}
            </div>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}