import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";
import AdSlot from "@/components/ads/ad-slot";
import { locales } from "@/lib/i18n/config";
import { VIEWER_REGISTRY, getViewerByExt } from "@/lib/config/viewer-registry";
import FileViewer from "@/components/viewer/FileViewer";
import ViewHistory from "@/components/viewer/ViewHistory";

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const fmt of VIEWER_REGISTRY) {
      params.push({ locale, slug: fmt.ext });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const fmt = getViewerByExt(slug);
  if (!fmt) return { title: "Viewer Not Found" };

  const ext = fmt.ext.toUpperCase();
  return {
    title: `Free Online ${ext} Viewer — Open ${ext} Files Instantly | EveryFileConvert`,
    description: `Open and view ${ext} files (${fmt.description}) directly in your browser. No installation, no account needed. 100% private — your files never leave your device.`,
    alternates: { canonical: `https://www.everyfileconvert.com/${locale}/view/${slug}` },
    keywords: [`${ext} viewer`, `open ${ext} online`, `view ${ext} file`, `${ext} reader online`, `free ${ext} viewer`],
  };
}

export default async function ViewerSlugPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const fmt = getViewerByExt(slug);
  if (!fmt) notFound();

  const ext = fmt.ext.toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/50 to-white">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-slate-500">
          <Link href={`/${locale}`} className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/${locale}/view`} className="hover:text-blue-600 transition-colors">Online Viewer</Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">{ext} Viewer</span>
        </div>

        {/* Header — 40px below any top ad (mt-12) */}
        <div className="mt-12 mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700 mb-4">
            <Eye className="h-4 w-4" />
            Free Online {ext} Viewer
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
            Open {ext} Files Instantly
          </h1>
          <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base">
            View {fmt.description} files directly in your browser. No installation, no account. 100% private — files never leave your device.
          </p>
        </div>

        {/* Viewer — my-12 for AdSense safety */}
        <div className="my-12">
          <FileViewer locale={locale} presetFormat={fmt.ext} />
          <ViewHistory locale={locale} />
        </div>

        {/*
          AD: drag_menu_under — Viewer ile "How to use" arasında
          my-8 güvenlik marjı, relative z-0 kaza tıklama koruması
          <!-- REKLAM KODU BURAYA GELECEK -->
        */}
        <div className="relative z-0 flex justify-center my-8 py-1" data-testid="ad-drag-menu-under">
          <AdSlot adUnit="drag_menu_under-336x280" width={336} height={280} />
        </div>

        {/* How to use */}
        <div className="mb-12 rounded-2xl bg-white border border-slate-100 shadow-sm p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">How to view {ext} files online</h2>
          <ol className="space-y-3 text-sm text-slate-600">
            {[
              `Drag & drop your .${fmt.ext} file into the zone above, or click to browse`,
              "Your file opens instantly — no upload to any server",
              "Scroll, zoom, and navigate your document directly in the browser",
              "Download the original file anytime using the Download button",
            ].map((step, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* FAQ */}
        <div className="mb-12 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
          {[
            [`Is this ${ext} viewer free?`, `Yes, completely free. Open any ${ext} file (${fmt.description}) with no limits, no sign-up, and no installation required.`],
            [`Is it safe to open ${ext} files here?`, `Your ${ext} file is processed entirely inside your browser using client-side JavaScript. It never leaves your device, is never uploaded to a server, and is automatically removed when you close the tab.`],
            [`What is the file size limit?`, `Up to 50 MB on desktop and 20 MB on mobile. For larger files, use our Convert tool which can process and compress files efficiently.`],
          ].map(([q, a]) => (
            <details key={q} className="rounded-xl border border-slate-100 bg-white shadow-sm">
              <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-slate-800 hover:text-blue-600">{q}</summary>
              <p className="px-5 pb-4 text-sm text-slate-600">{a}</p>
            </details>
          ))}
        </div>

        {/* CTA — mb-12 for AdSense safety */}
        <div className="mb-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 p-8 text-center text-white shadow-xl">
          <h3 className="text-xl font-bold mb-2">Need to convert this {ext} file?</h3>
          <p className="text-sm text-blue-100 mb-5">Convert {ext} to PDF, PNG, DOCX, and many more formats.</p>
          <Link
            href={`/${locale}/${fmt.ext}`}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-600 shadow hover:bg-blue-50 transition-colors"
          >
            Convert {ext} Files
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
