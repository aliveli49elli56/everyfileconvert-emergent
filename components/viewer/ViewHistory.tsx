"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, X, Eye } from "lucide-react";
import { getViewerByExt, VIEWER_CATEGORY_META } from "@/lib/config/viewer-registry";

export interface HistoryEntry {
  name: string;
  ext: string;
  size: number;
  viewedAt: number; // epoch ms
  locale: string;
}

const STORAGE_KEY = "viewer_history";
const MAX_ENTRIES = 12;

// ── Storage helpers ────────────────────────────────────────────────────────────
export function addToViewHistory(entry: Omit<HistoryEntry, "viewedAt">) {
  if (typeof window === "undefined") return;
  try {
    const prev = getViewHistory();
    const deduped = prev.filter((e) => !(e.name === entry.name && e.ext === entry.ext));
    const next: HistoryEntry[] = [{ ...entry, viewedAt: Date.now() }, ...deduped].slice(0, MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("viewer-history-updated"));
  } catch {}
}

export function getViewHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as HistoryEntry[];
  } catch {
    return [];
  }
}

export function clearViewHistory() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("viewer-history-updated"));
}

function removeHistoryEntry(viewedAt: number) {
  if (typeof window === "undefined") return;
  try {
    const next = getViewHistory().filter((e) => e.viewedAt !== viewedAt);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("viewer-history-updated"));
  } catch {}
}

function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1_048_576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ViewHistory({ locale }: { locale: string }) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const refresh = () => setHistory(getViewHistory());

  useEffect(() => {
    refresh();
    window.addEventListener("viewer-history-updated", refresh);
    return () => window.removeEventListener("viewer-history-updated", refresh);
  }, []);

  if (history.length === 0) return null;

  return (
    <div className="w-full mt-10" data-testid="view-history">
      <div className="flex items-center justify-between mb-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-600">
          <Clock className="h-4 w-4 text-slate-400" />
          Recently Viewed
        </h3>
        <button
          onClick={clearViewHistory}
          className="text-xs text-slate-400 hover:text-red-500 transition-colors"
          data-testid="clear-history-btn"
        >
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {history.map((entry) => {
          const fmt = getViewerByExt(entry.ext);
          const meta = fmt ? VIEWER_CATEGORY_META[fmt.category] : null;
          return (
            <div
              key={entry.viewedAt}
              className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-3 py-2.5 hover:border-blue-200 hover:shadow-sm transition-all"
            >
              {/* Icon */}
              <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${meta?.gradient ?? "from-slate-400 to-slate-500"} shadow-sm`}>
                <Eye className="h-3.5 w-3.5 text-white" />
              </div>

              {/* Info */}
              <Link
                href={`/${entry.locale}/view/${entry.ext}`}
                className="flex-1 min-w-0"
                data-testid={`history-item-${entry.viewedAt}`}
              >
                <p className="truncate text-xs font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                  {entry.name}
                </p>
                <p className="text-[10px] text-slate-400">
                  <span className="font-medium text-slate-500 uppercase">.{entry.ext}</span>
                  {" · "}{formatSize(entry.size)}
                  {" · "}{formatRelativeTime(entry.viewedAt)}
                </p>
              </Link>

              {/* Remove */}
              <button
                onClick={(e) => { e.preventDefault(); removeHistoryEntry(entry.viewedAt); }}
                className="flex-shrink-0 rounded-md p-1 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 hover:bg-red-50 transition-all"
                data-testid={`remove-history-${entry.viewedAt}`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
