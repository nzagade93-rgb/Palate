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
  title: "PALATE — India's Food Fights Begin Here | Navi Mumbai",
  description: "Your favourite dish is someone's biggest debate. Vote, settle the score, and defend your taste across Navi Mumbai's most heated culinary rivalries.",
  manifest: '/manifest.json',
  metadataBase: new URL('https://palate.app'),
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PALATE',
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/apple-touch-icon.png',
  },
  openGraph: {
    title: "PALATE — India's Food Fights Begin Here",
    description: "Who makes the better Vada Pav, Misal, Biryani, and Seafood in Navi Mumbai? Settle the score now.",
    type: 'website',
    siteName: 'PALATE',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: "PALATE — India's Food Fights Begin Here",
    description: "Your favourite dish is someone's biggest debate. Vote and defend your taste.",
  },
};

export const viewport: Viewport = {
  themeColor: '#FFD11A',
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
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body className="min-h-full bg-[#F6EFE2] text-[#121212] selection:bg-[#FFD11A] selection:text-[#121212]">
        <PWARegistration />
        {children}
      </body>
    </html>
  );
}
