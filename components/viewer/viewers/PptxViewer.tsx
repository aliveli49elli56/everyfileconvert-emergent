"use client";
import { useEffect, useState } from "react";

interface Slide { title: string; body: string }

export default function PptxViewer({ file }: { file: File }) {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const JSZip = (await import("jszip")).default;
        const buf = await file.arrayBuffer();
        const zip = await JSZip.loadAsync(buf);

        const slideFiles = Object.keys(zip.files)
          .filter(k => /ppt\/slides\/slide\d+\.xml$/.test(k))
          .sort((a, b) => {
            const na = parseInt(a.match(/\d+/)?.[0] ?? "0");
            const nb = parseInt(b.match(/\d+/)?.[0] ?? "0");
            return na - nb;
          });

        const result: Slide[] = [];
        for (const sf of slideFiles) {
          const xml = await zip.file(sf)!.async("text");
          const texts = Array.from(xml.matchAll(/<a:t>([^<]*)<\/a:t>/g)).map(m => m[1]).filter(Boolean);
          result.push({ title: texts[0] ?? `Slide ${result.length + 1}`, body: texts.slice(1).join(" ") });
        }
        setSlides(result);
        setLoading(false);
      } catch (e: any) { setError(e.message || "Could not read presentation"); }
    })();
  }, [file]);

  return (
    <div className="flex flex-col h-full min-h-[400px]">
      {loading && !error && <div className="flex justify-center py-10"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" /></div>}
      {error && <p className="text-center text-red-500 py-10">{error}</p>}
      {slides.length > 0 && (
        <>
          {/* Slide canvas */}
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 p-8 min-h-[320px]">
            <div className="w-full max-w-2xl aspect-video bg-white rounded-xl shadow-2xl p-10 flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">{slides[current].title}</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{slides[current].body}</p>
            </div>
          </div>
          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 py-3 border-t border-slate-100">
            <button onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}
              className="px-4 py-1.5 rounded-lg text-sm font-semibold border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors">
              ‹ Prev
            </button>
            <span className="text-xs text-slate-500">{current + 1} / {slides.length}</span>
            <button onClick={() => setCurrent(c => Math.min(slides.length - 1, c + 1))} disabled={current === slides.length - 1}
              className="px-4 py-1.5 rounded-lg text-sm font-semibold border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors">
              Next ›
            </button>
          </div>
        </>
      )}
    </div>
  );
}
