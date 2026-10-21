import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import PWARegistration from '@/components/PWARegistration';

const sans = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Palate — Food Worth Talking About | Navi Mumbai',
  description:
    'Food worth talking about. Hyper-local, dish-first food discovery and culinary consensus across Navi Mumbai (Vashi, Nerul, Belapur, Kharghar, Seawoods, and Sanpada).',
  manifest: '/manifest.json',
  metadataBase: new URL('https://palate.app'),
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Palate',
  },
  icons: {
    icon: '/icons/icon.svg',
    apple: '/icons/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Palate — Food Worth Talking About',
    description:
      'Hyper-local, dish-first food discovery and culinary consensus across Navi Mumbai. Settle the score and find dishes worth talking about.',
    type: 'website',
    siteName: 'Palate',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Palate — Food Worth Talking About',
    description:
      'Hyper-local, dish-first food discovery across Navi Mumbai. Food worth talking about.',
  },
};

export const viewport: Viewport = {
  themeColor: '#0F5132',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} h-full antialiased`}>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="icon" type="image/svg+xml" href="/icons/icon.svg" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body className="min-h-full bg-[#FFF8EE] text-[#3A2E28] selection:bg-[#F6B21A] selection:text-[#3A2E28]">
        <PWARegistration />
        {children}
      </body>
    </html>
  );
}
