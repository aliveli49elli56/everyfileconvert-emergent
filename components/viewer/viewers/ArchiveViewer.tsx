"use client";
import { useEffect, useState } from "react";
import { FileArchive, File } from "lucide-react";

interface ZipEntry { name: string; size: number; dir: boolean }

export default function ArchiveViewer({ file }: { file: File }) {
  const [entries, setEntries] = useState<ZipEntry[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const JSZip = (await import("jszip")).default;
        const buf = await file.arrayBuffer();
        const zip = await JSZip.loadAsync(buf);
        const list: ZipEntry[] = Object.values(zip.files).map((f) => ({
          name: f.name,
          size: (f as any)._data?.uncompressedSize ?? 0,
          dir: f.dir,
        }));
        list.sort((a, b) => (a.dir === b.dir ? a.name.localeCompare(b.name) : a.dir ? -1 : 1));
        setEntries(list);
        setLoading(false);
      } catch (e: any) { setError(e.message || "Could not read archive"); }
    })();
  }, [file]);

  return (
    <div className="p-4">
      {loading && !error && <div className="flex justify-center py-10"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" /></div>}
      {error && <p className="text-center text-red-500 py-10">{error}</p>}
      {!loading && (
        <>
          <p className="text-xs text-slate-400 mb-3">{entries.length} entries</p>
          <div className="divide-y divide-slate-50 rounded-xl border border-slate-100 overflow-hidden text-xs max-h-[60vh] overflow-y-auto">
            {entries.map((e, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50">
                {e.dir
                  ? <FileArchive className="h-4 w-4 text-amber-400 flex-shrink-0" />
                  : <File className="h-4 w-4 text-slate-400 flex-shrink-0" />}
                <span className="truncate text-slate-700">{e.name}</span>
                {!e.dir && <span className="ml-auto flex-shrink-0 text-slate-400">{(e.size / 1024).toFixed(1)} KB</span>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
