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
  metadataBase: new URL('https://cuahangtudongnro.vercel.app'),
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
    url: 'https://cuahangtudongnro.vercel.app',
    title: `${SITE_CONFIG.name} — Nền Tảng Tool Game NRO Online`,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 675,
        alt: `${SITE_CONFIG.name} — Nền Tảng Tool Game NRO Online`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_CONFIG.name} — Nền Tảng Tool Game NRO Online`,
    description: SITE_CONFIG.description,
    images: ['/og-image.jpg'],
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
        <ToastProvider>
          <AuthProvider>
            <WishlistProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <SupportWidget />
              <MobileBottomNav />
            </WishlistProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
