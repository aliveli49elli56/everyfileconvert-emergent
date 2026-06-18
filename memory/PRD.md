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
- public/unrar.wasm — RAR extraction WASM binary (203KB, node-unrar-js v2.0.2)

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
- viewer-registry.ts: 55+ formats with category/engine/description metadata
- ViewerHub component: grouped format cards with category colors
- FileViewer component: drop zone + file size guard + engine routing
- Viewer engines: PDF (pdfjs), DOCX (mammoth), Sheet (SheetJS/xlsx), Text,
  Image (native), Archive (JSZip + node-unrar-js WASM), Email (EML), Media (video/audio HTML5),
  EPUB, PPTX (ZIP XML parse), PSD (ag-psd), CAD/DXF (dxf package → SVG)
- Pages: /[locale]/view (hub) + /[locale]/view/[slug] (per-format)
- Navbar: "Online Viewer" link added
- HomeClient: "Online Viewer" card in All-In-One Tools grid
- All 17 locale files: onlineViewer + onlineViewerDesc keys added
- Sitemap: viewer URLs added to paginated pool
- File size limits: 50MB desktop, 20MB mobile; smart redirect to converter

### 2025-06-18: View History Feature (localStorage)
- ViewHistory.tsx component: shows recently viewed files with filename, ext badge, size, relative time
- Persists up to 12 entries in localStorage; cross-tab sync via custom "viewer-history-updated" event
- Clear-all + per-entry remove buttons
- Shown on both /view hub and individual /view/[slug] pages
- FileViewer.tsx automatically records every successfully opened file

### 2025-06-18: Phase 3 - DXF CAD Viewer (NEW)
- Installed dxf@5.3.1 package (pure JS DXF parser with Helper.toSVG())
- CadViewer.tsx: dark canvas (bg-slate-950) with zoom controls (in/out/fit/reset)
- SVG post-processing: replaces black strokes rgb(0,0,0)/#000000 → #4ade80 (green)
  and boosts stroke-width from 0.1% to 0.3% for better visibility
- viewer-registry.ts: DXF engine updated from 'text' to 'cad'
- FileViewer.tsx: CadViewer lazy-loaded for 'cad' engine
- types/dxf.d.ts: TypeScript declaration file for dxf package

### 2025-06-18: Phase 3 - RAR Archive Viewer (NEW)
- Installed node-unrar-js@2.0.2 (Emscripten WASM port of official UnRAR)
- public/unrar.wasm copied from node_modules (203KB)
- ArchiveViewer.tsx: extended to detect RAR by extension, extracts via WASM
  (extractZip → JSZip for .zip; extractRar → node-unrar-js for .rar)
- Shows folder count, file count, total uncompressed size
- Error handling for encrypted/corrupted RAR
- viewer-registry.ts: RAR entry added (archive engine, shared with ZIP)
- next.config.js: transpilePackages: ['node-unrar-js'] added

### Build Results (next build — Done in 97s)
- 901+ viewer static pages generated
- Sitemap chunks: 6 files (0-5.xml), viewer URLs added to pool
- Zero TypeScript errors, zero build failures

## Packages Installed
- xlsx (SheetJS)
- docx-preview
- ag-psd
- dxf@5.3.1 (DXF→SVG renderer, Phase 3)
- node-unrar-js@2.0.2 (RAR WASM extractor, Phase 3)

## Prioritized Backlog

### Phase 1 — Complete
- Vietnamese locale removal, pdfjs fix, EbookEngine, FormatSelector, Online Viewer (53+ formats), View History, next build ✅

### Phase 2 — Complete
- Visual PPTX renderer (XML → HTML/CSS layout with thumbnail strip) ✅
- Footer format counts dynamically updated ✅

### 2025-06-18: Static Ad Placement Architecture (NEW)
- Completely redesigned layout for AdSense safety and optimal placement
- **Layout restructure**: Removed `xl:px-44` body padding + old fixed-positioned `SidebarAds`
- **Desktop 3-column grid**: `grid-cols-1 lg:grid-cols-[160px_minmax(0,1fr)_160px]` in layout.tsx
- **Left/Right 160×600 sticky sidebars**: `hidden lg:flex` (hidden on mobile/tablet), `sticky top-20` scrolling behavior
- **Leaderboard REMOVED**: `LeaderboardAd` completely removed from layout (per AdSense accidental-click policy)
- **drag_menu_under 336×280**: Between UniversalDropzone hero and All-In-One Tools, `relative z-0 my-8`, universal (desktop + mobile)
- **tools_infeed_1 300×250**: Mobile-only (`block sm:hidden`), between Video Converter and Audio Converter cards in grid — `relative z-0 my-8` safety margin
- **AdSlot placeholder redesign**: `bg-slate-50`, `text-[10px] text-gray-400 tracking-widest uppercase`, "ADVERTISEMENT" label + dimensions
- **HTML comments**: `{/* <!-- REKLAM KODU BURAYA GELECEK --> */}` in all ad slot locations
- **suppressHydrationWarning**: Added to root layout body to prevent i18n/font className mismatch warning
- HomeClient.tsx: Removed all `xl:-mx-44` negative margins (no longer needed without body padding)

### 2025-06-18: Ad Layout Genişletme (Converter + Viewer Sayfaları)
- **4 Converter sayfası** (video, audio, image, pdf-tools): `drag_menu_under` 336×280 slotu eklendi (dropzone ↔ Popular Conversions arası)
- **Viewer Hub** (`/view`): `xl:-mx-44` temizlendi, `drag_menu_under` hero ↔ format grid arasına eklendi
- **Viewer Slug** (`/view/[slug]`): `drag_menu_under` FileViewer/ViewHistory ↔ "How to use" arasına eklendi
- Tüm sayfalarda `data-testid="ad-drag-menu-under"`, `relative z-0`, `my-8` güvenlik marjı
- 8 sayfa toplam → 3-sütunlu desktop sidebars + inline drag_menu_under aktif

### Phase 3 — Complete
- DXF CAD Viewer with SVG rendering, zoom controls, dark canvas ✅
- RAR Archive Viewer with node-unrar-js WASM ✅

### Phase 4: Future Work (Backlog)
- DWG viewer (proprietary format, needs specialized WASM — very complex)
- 7z archive viewer support
- PPTX complex shape/image support improvements
- PSD layer preview panel
- Binary DXF support (currently only ASCII DXF supported)

## Key Technical Constraints
- Zero Backend: All file processing runs natively in browser without server uploads
- AdSense Layout: 40px vertical margin (mt-12 mb-12) around viewer canvas
- File Size Limits: 50MB desktop / 20MB mobile with smart redirect to converter
- WASM Files: pdf.worker.min.mjs and unrar.wasm served from /public/
