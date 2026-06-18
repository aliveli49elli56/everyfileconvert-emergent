import Script from 'next/script';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin', 'latin-ext'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://everyfileconvert.com'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        />

        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-8200B0JX4N"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-8200B0JX4N');
          `}
        </Script>
      </head>
      {/*
        Body classes are intentionally minimal here.
        The [locale]/layout.tsx is responsible for the full body structure
        (lang, dir, flex layout). The font class is the ONLY class applied here
        to avoid hydration mismatches — locale layout will inherit it.
      */}
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
