"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Upload,
  Download,
  X,
  CheckCircle2,
  BookOpen,
  AlertTriangle,
  FileText,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  revokeObjectURL,
  createDownloadUrl,
  triggerFileDownload,
} from "@/lib/file-validation";
import { CONVERSION_MATRIX, getFormatEntry } from "@/lib/config/master-registry";

// PDF Worker Yaması: PDF.js hatasını engellemek için
import * as pdfjsLib from 'pdfjs-dist';
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

interface EbookConverterProps {
  defaultFrom?: string;
  defaultTo?: string;
}

const EBOOK_FORMATS = ["epub", "mobi", "azw3", "pdf", "txt", "html"] as const;
type EbookFormat = (typeof EBOOK_FORMATS)[number];

function getEbookTargets(from: EbookFormat): EbookFormat[] {
  return (CONVERSION_MATRIX[from] ?? []).filter(
    (ext): ext is EbookFormat => EBOOK_FORMATS.includes(ext as EbookFormat)
  );
}

const ACCEPTED_MIMES = ".epub,.mobi,.azw3,.azw,.pdf,.txt,.html,.htm";

function getDeviceLimits(): { maxBytes: number; maxLabel: string } {
  if (typeof navigator === "undefined") {
    return { maxBytes: 500 * 1024 * 1024, maxLabel: "500 MB" };
  }
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || (navigator.maxTouchPoints > 1 && window.innerWidth < 768);
  return isMobile
    ? { maxBytes: 200 * 1024 * 1024, maxLabel: "200 MB" }
    : { maxBytes: 500 * 1024 * 1024, maxLabel: "500 MB" };
}

function formatFileSize(bytes: number): string {
  if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(1) + " GB";
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + " MB";
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + " KB";
  return bytes + " bytes";
}

function detectFormatFromFile(file: File): EbookFormat | null {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!ext) return null;
  if (ext === "azw" || ext === "azw3") return "azw3";
  if (ext === "htm") return "html";
  if (EBOOK_FORMATS.includes(ext as EbookFormat)) return ext as EbookFormat;
  return null;
}

async function convertEpubToText(file: File): Promise<string> {
  const JSZip = (await import("jszip")).default;
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  const texts: string[] = [];
  const opfEntry = Object.keys(zip.files).find(
    (name) => name.endsWith(".opf") || name === "content.opf"
  );

  if (opfEntry) {
    const opfContent = await zip.files[opfEntry].async("string");
    const parser = new DOMParser();
    const opfDoc = parser.parseFromString(opfContent, "application/xml");
    const idrefs = Array.from(opfDoc.querySelectorAll("spine itemref")).map(
      (el) => el.getAttribute("idref") || ""
    );
    const manifest: Record<string, string> = {};
    opfDoc.querySelectorAll("manifest item").forEach((el) => {
      manifest[el.getAttribute("id") || ""] = el.getAttribute("href") || "";
    });

    const basePath = opfEntry.includes("/")
      ? opfEntry.substring(0, opfEntry.lastIndexOf("/") + 1)
      : "";

    for (const idref of idrefs) {
      const href = manifest[idref];
      if (!href) continue;
      const fullPath = basePath + href;
      const entry = zip.files[fullPath] || zip.files[href];
      if (!entry) continue;
      const html = await entry.async("string");
      const doc = new DOMParser().parseFromString(html, "text/html");
      texts.push(doc.body.textContent || "");
    }
  } else {
    for (const [name, entry] of Object.entries(zip.files)) {
      if ((name.endsWith(".html") || name.endsWith(".xhtml")) && !entry.dir) {
        const html = await entry.async("string");
        const doc = new DOMParser().parseFromString(html, "text/html");
        texts.push(doc.body.textContent || "");
      }
    }
  }
  return texts.join("\n\n");
}

async function convertEpubToHtml(file: File): Promise<string> {
  const JSZip = (await import("jszip")).default;
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  const parts: string[] = [];
  const opfEntry = Object.keys(zip.files).find(
    (name) => name.endsWith(".opf") || name === "content.opf"
  );

  if (opfEntry) {
    const opfContent = await zip.files[opfEntry].async("string");
    const parser = new DOMParser();
    const opfDoc = parser.parseFromString(opfContent, "application/xml");
    const idrefs = Array.from(opfDoc.querySelectorAll("spine itemref")).map(
      (el) => el.getAttribute("idref") || ""
    );
    const manifest: Record<string, string> = {};
    opfDoc.querySelectorAll("manifest item").forEach((el) => {
      manifest[el.getAttribute("id") || ""] = el.getAttribute("href") || "";
    });
    const basePath = opfEntry.includes("/")
      ? opfEntry.substring(0, opfEntry.lastIndexOf("/") + 1)
      : "";

    for (const idref of idrefs) {
      const href = manifest[idref];
      if (!href) continue;
      const fullPath = basePath + href;
      const entry = zip.files[fullPath] || zip.files[href];
      if (!entry) continue;
      parts.push(await entry.async("string"));
    }
  } else {
    for (const [name, entry] of Object.entries(zip.files)) {
      if ((name.endsWith(".html") || name.endsWith(".xhtml")) && !entry.dir) {
        parts.push(await entry.async("string"));
      }
    }
  }
  const combined = parts.join("\n");
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Converted eBook</title></head><body>${combined}</body></html>`;
}

async function textToPdfBlob(text: string): Promise<Blob> {
  const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;
  const lineHeight = 16;
  const margin = 50;
  const pageWidth = 595;
  const pageHeight = 842;
  const usableWidth = pageWidth - 2 * margin;
  const linesPerPage = Math.floor((pageHeight - 2 * margin) / lineHeight);

  const words = text.replace(/\r\n/g, "\n").split("\n");
  const allLines: string[] = [];

  for (const paragraph of words) {
    if (!paragraph.trim()) {
      allLines.push("");
      continue;
    }
    const wordTokens = paragraph.split(" ");
    let currentLine = "";
    for (const word of wordTokens) {
      const testLine = currentLine ? currentLine + " " + word : word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);
      if (testWidth > usableWidth && currentLine) {
        allLines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) allLines.push(currentLine);
  }

  let lineIndex = 0;
  while (lineIndex < allLines.length) {
    const page = doc.addPage([pageWidth, pageHeight]);
    const chunk = allLines.slice(lineIndex, lineIndex + linesPerPage);
    chunk.forEach((line, i) => {
      page.drawText(line, {
        x: margin,
        y: pageHeight - margin - i * lineHeight,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    });
    lineIndex += linesPerPage;
  }

  const bytes = await doc.save();
  return new Blob([bytes], { type: "application/pdf" });
}

async function performConversion(
  file: File,
  fromFormat: EbookFormat,
  toFormat: EbookFormat
): Promise<Blob> {
  if (toFormat === "txt") {
    if (fromFormat === "epub") {
      const text = await convertEpubToText(file);
      return new Blob([text], { type: "text/plain" });
    }
    if (fromFormat === "html") {
      const html = await file.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      return new Blob([doc.body.textContent || ""], { type: "text/plain" });
    }
    const text = await file.text();
    return new Blob([text], { type: "text/plain" });
  }

  if (toFormat === "html") {
    if (fromFormat === "epub") {
      const html = await convertEpubToHtml(file);
      return new Blob([html], { type: "text/html" });
    }
    if (fromFormat === "txt") {
      const text = await file.text();
      const escaped = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>\n");
      return new Blob(
        [
          `<!DOCTYPE html><html><head><meta charset
