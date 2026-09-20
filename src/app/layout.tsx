import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth/AuthContext';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#07090e',
};

export const metadata: Metadata = {
  title: 'Charan AI | Intelligent Multimodal Assistant',
  description:
    'Charan AI is a fast, responsive AI assistant with live search, image generation, document RAG, and multi-device mobile app capabilities.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Charan AI',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body className="antialiased bg-[#07090e] text-slate-100 h-full overflow-hidden select-none selection:bg-amber-500 selection:text-black touch-manipulation">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
