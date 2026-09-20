import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { SITE_CONFIG } from '@/lib/constants';
import { AuthProvider } from '@/contexts/auth-context';
import { WishlistProvider } from '@/contexts/wishlist-context';
import { ToastProvider } from '@/contexts/toast-context';
import { SupportWidget } from '@/components/support/support-widget';
import { MobileBottomNav } from '@/components/mobile-bottom-nav';

export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} — Nền Tảng Tool Game NRO Online Số 1`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  authors: [{ name: 'TUDONGNRO Team' }],
  creator: 'TUDONGNROTT.com',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://tudongnrott.com',
    title: `${SITE_CONFIG.name} — Nền Tảng Tool Game NRO Online`,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#080B12] text-slate-100 antialiased selection:bg-cyan-500 selection:text-black pb-14 md:pb-0">
        <AuthProvider>
          <WishlistProvider>
            <ToastProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <SupportWidget />
              <MobileBottomNav />
            </ToastProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
