# EveryFileConvert — PRD

## Problem Statement
Client-side file conversion and viewing tool built with Next.js (App Router) and Tailwind CSS.
Multi-language (17 locales), programmatic SEO, zero server-side processing.

## Architecture
- Next.js 13.5.1 App Router + Tailwind CSS
- 17 active locales (en, tr, de, fr, es, it, pt, ja, zh, nl, pl, ko, sv, da, no, hu, fi) — vi removed
- lib/config/master-registry.ts — conversion matrix (NEVER modify)
- lib/config/viewer-registry.ts — viewer format registry
- lib/engine/ — client-side conversion engines
- public/pdf.worker.min.mjs — pdfjs worker

## What's Been Implemented

### 2025-06-18: Vietnamese Locale Removal
- Deleted locales/vi.json
- Removed "vi" from all locale arrays (config, middleware, sitemap, 9× page files)
- Added 301 redirects /vi → /en, /vi/:path* → /en/:path*
- master-registry.ts untouched

### 2025-06-18: Conversion Bug Fixes
- Fixed pdfjs-dist v4 GlobalWorkerOptions.workerSrc (empty → /pdf.worker.min.mjs)
- Created EbookEngine.ts for EPUB/TXT/HTML→any client-side conversions
- Fixed PDF→TXT/HTML/EPUB/DOCX output format (was always returning PDF)
- Added EBOOK_EXTS domain + ebook:convert operation to Transcoder

### 2025-06-18: UI Updates
- Gradient background full-screen width (xl:-mx-44)
- Removed "100M+ files converted" badge
- Content moved up (-mt-[122px] + pt-[122px])
- Supported Formats → FormatSelector (dynamic dropdowns from master-registry)
- FormatSelector auto-redirects to /[locale]/[from]-to-[to]

### 2025-06-18: Online Viewer Ecosystem
- viewer-registry.ts: 53+ formats with category/engine/description metadata
- ViewerHub component: grouped format cards with category colors
- FileViewer component: drop zone + file size guard + engine routing
- Viewer engines: PDF (pdfjs), DOCX (mammoth), Sheet (SheetJS/xlsx), Text,
  Image (native), Archive (JSZip), Email (EML), Media (video/audio HTML5),
  EPUB, PPTX (ZIP XML parse), PSD (ag-psd)
- Pages: /[locale]/view (hub) + /[locale]/view/[slug] (per-format)
- Navbar: "Online Viewer" link added
- HomeClient: "Online Viewer" card in All-In-One Tools grid
- All 17 locale files: onlineViewer + onlineViewerDesc keys added
- Sitemap: viewer URLs added to paginated pool
- File size limits: 50MB desktop, 20MB mobile; smart redirect to converter

## Packages Installed
- xlsx (SheetJS)
- docx-preview
- ag-psd

## Prioritized Backlog
- P0: ✅ Complete
- P1: Test all viewer engines with real files in production
- P1: Add DWG viewer (requires WASM port)
- P2: Add RAR/7z archive viewer
- P2: PPTX visual rendering (currently text-only XML parse)
- P2: PSD layer preview panel
