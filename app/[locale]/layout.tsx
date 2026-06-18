import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { Toaster } from '@/components/ui/sonner';
import AdSlot from '@/components/ads/ad-slot';
import { locales, defaultLocale, getDictionary, isRTL, getHreflangLinks } from '@/lib/i18n/config';
import type { Locale } from '@/lib/i18n/config';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const meta = dict.meta as Record<string, string>;
  const hreflangs = getHreflangLinks('');

  return {
    title: meta?.homeTitle || 'EveryFileConvert - Free Online File Converter',
    description: meta?.homeDesc || 'Convert any file format instantly in your browser.',
    keywords: 'file converter, video converter, audio converter, image converter, pdf converter, free converter, online converter',
    authors: [{ name: 'EveryFileConvert' }],
    creator: 'EveryFileConvert',
    publisher: 'EveryFileConvert',
    robots: 'index, follow',
    openGraph: {
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : `${locale}_${locale.toUpperCase()}`,
      url: `https://everyfileconvert.com/${locale}`,
      siteName: 'EveryFileConvert',
      title: meta?.homeTitle || 'EveryFileConvert - Free Online File Converter',
      description: meta?.homeDesc || 'Convert any file format instantly in your browser.',
      images: [{
        url: 'https://images.pexels.com/photo/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=1200',
        width: 1200,
        height: 630,
        alt: 'EveryFileConvert - Free Online File Converter',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta?.homeTitle || 'EveryFileConvert - Free Online File Converter',
      description: meta?.homeDesc || 'Convert any file format instantly in your browser.',
      images: ['https://images.pexels.com/photo/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=1200'],
    },
    alternates: {
      canonical: `https://everyfileconvert.com/${locale}`,
      languages: Object.fromEntries(hreflangs.map(({ locale: l, href }) => [l, href])),
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const rtl = isRTL(locale as Locale);
  const hreflangs = getHreflangLinks('');

  return (
    <html lang={locale} dir={rtl ? 'rtl' : 'ltr'}>
      <head>
        {hreflangs.map(({ locale: l, href }) => (
          <link key={l} rel="alternate" hrefLang={l} href={href} />
        ))}
        <link rel="alternate" hrefLang="x-default" href="https://everyfileconvert.com/en" />
      </head>
      {/*
        Body has NO horizontal padding — the 3-column grid below handles spacing.
        Navbar and Footer span full width outside the grid.
      */}
      <body className="min-h-screen flex flex-col">
        <Navbar locale={locale as Locale} />

        {/*
          3-column page layout (lg and above):
          [160px sidebar] [main content] [160px sidebar]
          Sidebars are hidden on mobile/tablet (hidden lg:block).
          Leaderboard ad is INTENTIONALLY REMOVED per placement policy.
        */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[160px_minmax(0,1fr)_160px] items-start">

          {/* ── Left Sidebar — 160×600 Sticky Banner ── */}
          <aside
            className="hidden lg:flex flex-col items-center pt-8"
            aria-label="Left sidebar advertisement"
          >
            {/* <!-- REKLAM KODU BURAYA GELECEK --> */}
            <div className="sticky top-20">
              <AdSlot
                adUnit="left-sidebar-160x600"
                width={160}
                height={600}
              />
            </div>
          </aside>

          {/* ── Main Content ── */}
          <div className="min-w-0">
            {children}
          </div>

          {/* ── Right Sidebar — 160×600 Sticky Banner ── */}
          <aside
            className="hidden lg:flex flex-col items-center pt-8"
            aria-label="Right sidebar advertisement"
          >
            {/* <!-- REKLAM KODU BURAYA GELECEK --> */}
            <div className="sticky top-20">
              <AdSlot
                adUnit="right-sidebar-160x600"
                width={160}
                height={600}
              />
            </div>
          </aside>

        </div>

        <Footer locale={locale as Locale} />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
