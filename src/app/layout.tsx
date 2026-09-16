import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { MarketplaceProvider } from '@/components/providers/marketplace-provider';
import CompareTray from '@/components/marketplace/compare-tray';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'BarterHub | Modern Circular Marketplace for Books, Gear & Barter',
  description:
    'Buy, sell, and swap second-hand books, textbooks, tech, and gear. Item-for-item barter, cash offers, verified traders, and PIN handshake verification.',
  keywords: ['barter', 'exchange', 'book swap', 'campus trade', 'second hand marketplace', 'peer to peer'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${jakarta.variable} font-sans flex flex-col min-h-full bg-surface text-on-surface antialiased selection:bg-primary selection:text-white`}>
        <MarketplaceProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CompareTray />
        </MarketplaceProvider>
      </body>
    </html>
  );
}
