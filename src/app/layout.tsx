import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Newsreader } from "next/font/google";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const serif = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Palate — Hyper-Local Dish-First Food Discovery | Navi Mumbai",
  description: "Curated community consensus on what dishes to order and what to skip across Vashi, Nerul, Belapur, Kharghar, Seawoods, and Sanpada.",
  keywords: ["Navi Mumbai Food", "Dish Recommendations", "Vashi", "Nerul", "Belapur", "Kharghar", "Seawoods", "Sanpada", "Must Order", "Palate"],
  openGraph: {
    title: "Palate — Hyper-Local Dish-First Food Discovery | Navi Mumbai",
    description: "Eat what's legendary. Skip what's mediocre. Authentic dish consensus by verified local eaters.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF8F5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#FAF8F5] text-[#1C1917] selection:bg-[#FEF3C7] selection:text-[#A16207]">
        {children}
      </body>
    </html>
  );
}
