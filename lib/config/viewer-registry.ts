/**
 * lib/config/viewer-registry.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Central source-of-truth for the Online Viewer feature.
 * DO NOT import from master-registry.ts — kept separate to avoid circular deps.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type ViewerCategory =
  | 'document' | 'spreadsheet' | 'presentation' | 'image'
  | 'video' | 'audio' | 'archive' | 'email'
  | 'design' | 'code' | 'cad' | 'ebook';

export type ViewerEngine =
  | 'native-image' | 'svg' | 'pdf' | 'docx' | 'spreadsheet'
  | 'text' | 'archive' | 'email' | 'video' | 'audio'
  | 'psd' | 'ebook' | 'pptx' | 'cad';

export interface ViewerFormat {
  ext: string;
  name: string;
  category: ViewerCategory;
  engine: ViewerEngine;
  mimeTypes: string[];
  description: string;
}

export const VIEWER_REGISTRY: ViewerFormat[] = [
  // ── Documents ────────────────────────────────────────────────────────────
  { ext: 'pdf',   name: 'PDF',           category: 'document',     engine: 'pdf',          mimeTypes: ['application/pdf'],                                                                        description: 'Portable Document Format' },
  { ext: 'docx',  name: 'DOCX',          category: 'document',     engine: 'docx',         mimeTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],               description: 'Microsoft Word Document' },
  { ext: 'doc',   name: 'DOC',           category: 'document',     engine: 'docx',         mimeTypes: ['application/msword'],                                                                     description: 'Microsoft Word 97-2003' },
  { ext: 'docm',  name: 'DOCM',          category: 'document',     engine: 'docx',         mimeTypes: ['application/vnd.ms-word.document.macroEnabled.12'],                                      description: 'Word Macro-Enabled Document' },
  { ext: 'rtf',   name: 'RTF',           category: 'document',     engine: 'docx',         mimeTypes: ['application/rtf', 'text/rtf'],                                                           description: 'Rich Text Format' },
  { ext: 'odt',   name: 'ODT',           category: 'document',     engine: 'docx',         mimeTypes: ['application/vnd.oasis.opendocument.text'],                                               description: 'OpenDocument Text' },
  { ext: 'txt',   name: 'TXT',           category: 'document',     engine: 'text',         mimeTypes: ['text/plain'],                                                                             description: 'Plain Text' },
  { ext: 'html',  name: 'HTML',          category: 'document',     engine: 'text',         mimeTypes: ['text/html'],                                                                              description: 'HyperText Markup Language' },
  { ext: 'htm',   name: 'HTM',           category: 'document',     engine: 'text',         mimeTypes: ['text/html'],                                                                              description: 'HyperText Markup Language' },
  { ext: 'md',    name: 'Markdown',      category: 'document',     engine: 'text',         mimeTypes: ['text/markdown'],                                                                          description: 'Markdown Document' },
  { ext: 'xml',   name: 'XML',           category: 'document',     engine: 'text',         mimeTypes: ['application/xml', 'text/xml'],                                                           description: 'Extensible Markup Language' },
  { ext: 'json',  name: 'JSON',          category: 'code',         engine: 'text',         mimeTypes: ['application/json'],                                                                       description: 'JavaScript Object Notation' },
  // ── Spreadsheets ─────────────────────────────────────────────────────────
  { ext: 'xlsx',  name: 'XLSX',          category: 'spreadsheet',  engine: 'spreadsheet',  mimeTypes: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],                     description: 'Microsoft Excel Spreadsheet' },
  { ext: 'xls',   name: 'XLS',           category: 'spreadsheet',  engine: 'spreadsheet',  mimeTypes: ['application/vnd.ms-excel'],                                                              description: 'Microsoft Excel 97-2003' },
  { ext: 'ods',   name: 'ODS',           category: 'spreadsheet',  engine: 'spreadsheet',  mimeTypes: ['application/vnd.oasis.opendocument.spreadsheet'],                                        description: 'OpenDocument Spreadsheet' },
  { ext: 'csv',   name: 'CSV',           category: 'spreadsheet',  engine: 'spreadsheet',  mimeTypes: ['text/csv'],                                                                               description: 'Comma-Separated Values' },
  { ext: 'tsv',   name: 'TSV',           category: 'spreadsheet',  engine: 'spreadsheet',  mimeTypes: ['text/tab-separated-values'],                                                              description: 'Tab-Separated Values' },
  // ── Presentations ─────────────────────────────────────────────────────────
  { ext: 'pptx',  name: 'PPTX',          category: 'presentation', engine: 'pptx',         mimeTypes: ['application/vnd.openxmlformats-officedocument.presentationml.presentation'],             description: 'Microsoft PowerPoint Presentation' },
  { ext: 'ppt',   name: 'PPT',           category: 'presentation', engine: 'pptx',         mimeTypes: ['application/vnd.ms-powerpoint'],                                                         description: 'Microsoft PowerPoint 97-2003' },
  // ── Images ────────────────────────────────────────────────────────────────
  { ext: 'jpg',   name: 'JPG',           category: 'image',        engine: 'native-image', mimeTypes: ['image/jpeg'],                                                                             description: 'JPEG Image' },
  { ext: 'jpeg',  name: 'JPEG',          category: 'image',        engine: 'native-image', mimeTypes: ['image/jpeg'],                                                                             description: 'JPEG Image' },
  { ext: 'png',   name: 'PNG',           category: 'image',        engine: 'native-image', mimeTypes: ['image/png'],                                                                              description: 'Portable Network Graphics' },
  { ext: 'gif',   name: 'GIF',           category: 'image',        engine: 'native-image', mimeTypes: ['image/gif'],                                                                              description: 'Graphics Interchange Format' },
  { ext: 'webp',  name: 'WebP',          category: 'image',        engine: 'native-image', mimeTypes: ['image/webp'],                                                                             description: 'WebP Image' },
  { ext: 'bmp',   name: 'BMP',           category: 'image',        engine: 'native-image', mimeTypes: ['image/bmp'],                                                                              description: 'Bitmap Image' },
  { ext: 'ico',   name: 'ICO',           category: 'image',        engine: 'native-image', mimeTypes: ['image/x-icon'],                                                                           description: 'Icon Image' },
  { ext: 'tiff',  name: 'TIFF',          category: 'image',        engine: 'native-image', mimeTypes: ['image/tiff'],                                                                             description: 'Tagged Image File Format' },
  { ext: 'avif',  name: 'AVIF',          category: 'image',        engine: 'native-image', mimeTypes: ['image/avif'],                                                                             description: 'AV1 Image File' },
  { ext: 'svg',   name: 'SVG',           category: 'image',        engine: 'svg',          mimeTypes: ['image/svg+xml'],                                                                          description: 'Scalable Vector Graphics' },
  { ext: 'heic',  name: 'HEIC',          category: 'image',        engine: 'native-image', mimeTypes: ['image/heic'],                                                                             description: 'High Efficiency Image Container' },
  // ── Design ────────────────────────────────────────────────────────────────
  { ext: 'psd',   name: 'PSD',           category: 'design',       engine: 'psd',          mimeTypes: ['image/vnd.adobe.photoshop'],                                                              description: 'Adobe Photoshop Document' },
  // ── Video ─────────────────────────────────────────────────────────────────
  { ext: 'mp4',   name: 'MP4',           category: 'video',        engine: 'video',        mimeTypes: ['video/mp4'],                                                                              description: 'MPEG-4 Video' },
  { ext: 'webm',  name: 'WebM',          category: 'video',        engine: 'video',        mimeTypes: ['video/webm'],                                                                             description: 'WebM Video' },
  { ext: 'mov',   name: 'MOV',           category: 'video',        engine: 'video',        mimeTypes: ['video/quicktime'],                                                                        description: 'QuickTime Movie' },
  { ext: 'avi',   name: 'AVI',           category: 'video',        engine: 'video',        mimeTypes: ['video/x-msvideo'],                                                                        description: 'Audio Video Interleave' },
  { ext: 'mkv',   name: 'MKV',           category: 'video',        engine: 'video',        mimeTypes: ['video/x-matroska'],                                                                       description: 'Matroska Video' },
  { ext: 'ogv',   name: 'OGV',           category: 'video',        engine: 'video',        mimeTypes: ['video/ogg'],                                                                              description: 'Ogg Video' },
  // ── Audio ─────────────────────────────────────────────────────────────────
  { ext: 'mp3',   name: 'MP3',           category: 'audio',        engine: 'audio',        mimeTypes: ['audio/mpeg'],                                                                             description: 'MPEG Audio Layer III' },
  { ext: 'wav',   name: 'WAV',           category: 'audio',        engine: 'audio',        mimeTypes: ['audio/wav'],                                                                              description: 'Waveform Audio' },
  { ext: 'ogg',   name: 'OGG',           category: 'audio',        engine: 'audio',        mimeTypes: ['audio/ogg'],                                                                              description: 'Ogg Vorbis Audio' },
  { ext: 'flac',  name: 'FLAC',          category: 'audio',        engine: 'audio',        mimeTypes: ['audio/flac'],                                                                             description: 'Free Lossless Audio Codec' },
  { ext: 'aac',   name: 'AAC',           category: 'audio',        engine: 'audio',        mimeTypes: ['audio/aac'],                                                                              description: 'Advanced Audio Coding' },
  { ext: 'm4a',   name: 'M4A',           category: 'audio',        engine: 'audio',        mimeTypes: ['audio/mp4'],                                                                              description: 'MPEG-4 Audio' },
  // ── Archives ─────────────────────────────────────────────────────────────
  { ext: 'zip',   name: 'ZIP',           category: 'archive',      engine: 'archive',      mimeTypes: ['application/zip'],                                                                        description: 'ZIP Archive' },
  { ext: 'rar',   name: 'RAR',           category: 'archive',      engine: 'archive',      mimeTypes: ['application/vnd.rar', 'application/x-rar-compressed'],                                   description: 'RAR Archive' },
  // ── Email ─────────────────────────────────────────────────────────────────
  { ext: 'eml',   name: 'EML',           category: 'email',        engine: 'email',        mimeTypes: ['message/rfc822'],                                                                         description: 'Email Message' },
  // ── Code ─────────────────────────────────────────────────────────────────
  { ext: 'js',    name: 'JavaScript',    category: 'code',         engine: 'text',         mimeTypes: ['application/javascript'],                                                                 description: 'JavaScript Source File' },
  { ext: 'ts',    name: 'TypeScript',    category: 'code',         engine: 'text',         mimeTypes: ['application/typescript'],                                                                 description: 'TypeScript Source File' },
  { ext: 'py',    name: 'Python',        category: 'code',         engine: 'text',         mimeTypes: ['text/x-python'],                                                                          description: 'Python Source File' },
  { ext: 'css',   name: 'CSS',           category: 'code',         engine: 'text',         mimeTypes: ['text/css'],                                                                               description: 'Cascading Style Sheets' },
  { ext: 'yaml',  name: 'YAML',          category: 'code',         engine: 'text',         mimeTypes: ['application/yaml'],                                                                       description: 'YAML Configuration File' },
  { ext: 'sql',   name: 'SQL',           category: 'code',         engine: 'text',         mimeTypes: ['application/sql'],                                                                        description: 'SQL Script' },
  // ── CAD & Vector ─────────────────────────────────────────────────────────
  { ext: 'dxf',   name: 'DXF',           category: 'cad',          engine: 'cad',          mimeTypes: ['image/vnd.dxf'],                                                                          description: 'Drawing Exchange Format' },
  // ── eBook ─────────────────────────────────────────────────────────────────
  { ext: 'epub',  name: 'EPUB',          category: 'ebook',        engine: 'ebook',        mimeTypes: ['application/epub+zip'],                                                                   description: 'Electronic Publication' },
];

/** Look up a viewer format by extension */
export function getViewerByExt(ext: string): ViewerFormat | undefined {
  return VIEWER_REGISTRY.find(f => f.ext === ext.toLowerCase());
}

/** All unique categories with their formats */
export function getViewerCategories(): Record<ViewerCategory, ViewerFormat[]> {
  const map = {} as Record<ViewerCategory, ViewerFormat[]>;
  for (const f of VIEWER_REGISTRY) {
    if (!map[f.category]) map[f.category] = [];
    map[f.category].push(f);
  }
  return map;
}

export const VIEWER_CATEGORY_META: Record<ViewerCategory, { label: string; color: string; gradient: string }> = {
  document:     { label: 'Documents',     color: 'text-blue-600',    gradient: 'from-blue-500 to-indigo-500' },
  spreadsheet:  { label: 'Spreadsheets',  color: 'text-emerald-600', gradient: 'from-emerald-500 to-teal-500' },
  presentation: { label: 'Presentations', color: 'text-orange-600',  gradient: 'from-orange-500 to-amber-500' },
  image:        { label: 'Images',        color: 'text-pink-600',    gradient: 'from-pink-500 to-rose-500' },
  video:        { label: 'Video',         color: 'text-red-600',     gradient: 'from-red-500 to-orange-500' },
  audio:        { label: 'Audio',         color: 'text-violet-600',  gradient: 'from-violet-500 to-purple-500' },
  archive:      { label: 'Archives',      color: 'text-amber-600',   gradient: 'from-amber-500 to-yellow-500' },
  email:        { label: 'Email',         color: 'text-cyan-600',    gradient: 'from-cyan-500 to-sky-500' },
  design:       { label: 'Design',        color: 'text-indigo-600',  gradient: 'from-indigo-500 to-blue-500' },
  code:         { label: 'Code & Data',   color: 'text-slate-600',   gradient: 'from-slate-500 to-gray-500' },
  cad:          { label: 'CAD & Vector',  color: 'text-teal-600',    gradient: 'from-teal-500 to-cyan-500' },
  ebook:        { label: 'eBooks',        color: 'text-amber-600',   gradient: 'from-amber-500 to-orange-500' },
};

// File size limits
export const VIEWER_LIMITS = {
  desktop: 50 * 1024 * 1024, // 50 MB
  mobile:  20 * 1024 * 1024, // 20 MB
};
