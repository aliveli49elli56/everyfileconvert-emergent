# EveryFileConvert — Vietnamese Locale Removal

## Original Problem Statement
Remove the Vietnamese language ('vi') completely from the project without touching UI, colors, layout, or the programmatic SEO (pSEO) conversion matrices. Implement 301 redirects for all previously indexed /vi/* routes.

## Architecture / Tech Stack
- Next.js (App Router) + Tailwind CSS
- i18n via custom locale config (lib/i18n/config.ts + middleware.ts)
- Programmatic SEO via CONVERSION_MATRIX in lib/config/master-registry.ts (untouched)
- Static sitemap generation via app/sitemap.ts

## Core Requirements (Static)
1. Delete locales/vi.json
2. Remove "vi" from all locale arrays (config, middleware, sitemap, all page generateStaticParams)
3. Remove vi/vi-VN from localeLanguageMap and VN from countryLocaleMap in middleware
4. Add 301 permanent redirects: /vi → /en and /vi/:path* → /en/:path*
5. Never touch master-registry.ts, Tailwind, globals.css, or UI components

## What's Been Implemented (2025-06-18)

### Files Modified
| File | Change |
|------|--------|
| `locales/vi.json` | **Deleted** |
| `lib/i18n/config.ts` | Removed "vi" from `locales` array; removed `vi: "Tiếng Việt"` from `localeNames` |
| `middleware.ts` | Removed "vi" from `locales` array; removed `vi`/`vi-VN` from `localeLanguageMap`; removed `VN: "vi"` + comment from `countryLocaleMap` |
| `app/sitemap.ts` | Removed "vi" from `LOCALES` array |
| `next.config.js` | Added `async redirects()` with 301 permanent redirects for `/vi` → `/en` and `/vi/:path*` → `/en/:path*` |
| `app/[locale]/[slug]/page.tsx` | Removed "vi" from inline `generateStaticParams` locales array |
| `app/[locale]/image-crop/page.tsx` | Same |
| `app/[locale]/pdf-tools/page.tsx` | Same |
| `app/[locale]/audio-converter/page.tsx` | Same |
| `app/[locale]/video-converter/page.tsx` | Same |
| `app/[locale]/image-resizer/page.tsx` | Same |
| `app/[locale]/background-remover/page.tsx` | Same |
| `app/[locale]/image-converter/page.tsx` | Same |
| `app/[locale]/compress-audio/page.tsx` | Same |

### Files Strictly Preserved
- `lib/config/master-registry.ts` — untouched
- All Tailwind config files — untouched
- `globals.css` and all UI components — untouched

## Prioritized Backlog
- P0: ✅ Complete
- P1: Verify build passes in deployment environment (next build)
- P2: Monitor Google Search Console for successful 301 redirect crawl coverage
