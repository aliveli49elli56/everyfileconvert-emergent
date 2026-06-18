"use client";
import Link from "next/link";
import { Eye } from "lucide-react";
import { VIEWER_REGISTRY, VIEWER_CATEGORY_META, getViewerCategories, type ViewerCategory } from "@/lib/config/viewer-registry";

const CATEGORY_ORDER: ViewerCategory[] = [
  "document", "spreadsheet", "presentation", "image",
  "design", "video", "audio", "archive", "email", "ebook", "code", "cad",
];

export default function ViewerHub({ locale }: { locale: string }) {
  const grouped = getViewerCategories();

  return (
    <div className="w-full">
      {CATEGORY_ORDER.filter(cat => grouped[cat]?.length).map((cat) => {
        const meta = VIEWER_CATEGORY_META[cat];
        const formats = grouped[cat];
        return (
          <div key={cat} className="mb-10">
            <h2 className={`text-sm font-bold uppercase tracking-widest mb-4 ${meta.color}`}>
              {meta.label}
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {formats.map((f) => (
                <Link
                  key={f.ext}
                  href={`/${locale}/view/${f.ext}`}
                  data-testid={`viewer-card-${f.ext}`}
                  className="group flex flex-col items-center gap-1.5 rounded-xl border border-slate-100 bg-white p-3 text-center hover:border-blue-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${meta.gradient} shadow-sm`}>
                    <Eye className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700">
                    .{f.ext.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-slate-400 leading-tight line-clamp-1">{f.name}</span>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
