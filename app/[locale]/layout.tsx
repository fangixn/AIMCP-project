import '../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

const locales = ['en', 'zh'];

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export const metadata: Metadata = {
  metadataBase: new URL('https://aimcp.vercel.app'),
  title: 'AIMCP - AI Model Context Protocol',
  description: 'Making AI context understanding possible through standardized protocols and collaborative architectures.',
  keywords: 'MCP, Model Context Protocol, AI, Context Understanding, Machine Learning',
  authors: [{ name: 'AIMCP Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'AIMCP - AI Model Context Protocol',
    description: 'Making AI context understanding possible through standardized protocols and collaborative architectures.',
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIMCP - AI Model Context Protocol',
    description: 'Making AI context understanding possible through standardized protocols and collaborative architectures.',
  },
};

export default async function RootLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-82BFBMWNFV"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-82BFBMWNFV');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
} 