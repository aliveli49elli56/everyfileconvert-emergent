import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Eye } from "lucide-react";
import { locales, type Locale } from "@/lib/i18n/config";
import { VIEWER_REGISTRY, getViewerCategories, VIEWER_CATEGORY_META } from "@/lib/config/viewer-registry";
import ViewerHub from "@/components/viewer/ViewerHub";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const totalFormats = VIEWER_REGISTRY.length;
  return {
    title: `Free Online File Viewer — Open ${totalFormats}+ Formats Instantly | EveryFileConvert`,
    description: `Open and view ${totalFormats}+ file formats directly in your browser — no installation, no account required. View PDF, DOCX, XLSX, images, videos, archives, and more instantly online.`,
    alternates: { canonical: `https://www.everyfileconvert.com/${locale}/view` },
  };
}

export default async function ViewerHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const totalFormats = VIEWER_REGISTRY.length;
  const grouped = getViewerCategories();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="hero-gradient xl:-mx-44 -mt-[122px] pt-[122px]">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700 mb-5">
            <Eye className="h-4 w-4" />
            {totalFormats}+ Formats — Zero Installation
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Free Online File Viewer
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Open and view any file format instantly in your browser. No software required, 100% private — your files never leave your device.
          </p>
        </div>
      </section>

      {/* Hub grid */}
      <section className="container mx-auto px-4 py-12">
        <ViewerHub locale={locale} />
      </section>
    </div>
  );
}
