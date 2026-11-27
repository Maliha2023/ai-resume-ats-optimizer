export type ResumeFileKind = 'pdf' | 'text' | 'unsupported';

export const MAX_TEXT_FILE_BYTES = 512 * 1024; // 512 KB
export const MAX_PDF_FILE_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_PDF_PAGES = 20;

export interface PdfTextLikeItem {
  str?: string;
  hasEOL?: boolean;
  transform?: number[];
}

export function detectResumeFileKind(
  fileName: string,
  mimeType: string
): ResumeFileKind {
  const lowerName = fileName.trim().toLowerCase();
  const lowerMime = mimeType.trim().toLowerCase();

  if (lowerName.endsWith('.pdf') || lowerMime === 'application/pdf') {
    return 'pdf';
  }

  if (
    /\.(txt|md|markdown|rtf)$/i.test(lowerName) ||
    lowerMime.startsWith('text/')
  ) {
    return 'text';
  }

  return 'unsupported';
}

export function validateResumeFile(file: {
  name: string;
  type: string;
  size: number;
}): { ok: true; kind: 'pdf' | 'text' } | { ok: false; error: string } {
  const kind = detectResumeFileKind(file.name, file.type);

  if (kind === 'unsupported') {
    return {
      ok: false,
      error:
        'Unsupported file format. Please upload a .pdf, .txt, or .md resume file (or paste text directly).',
    };
  }

  if (file.size === 0) {
    return {
      ok: false,
      error: 'The selected file is empty.',
    };
  }

  if (kind === 'pdf' && file.size > MAX_PDF_FILE_BYTES) {
    return {
      ok: false,
      error: 'PDF file is too large (maximum 5 MB).',
    };
  }

  if (kind === 'text' && file.size > MAX_TEXT_FILE_BYTES) {
    return {
      ok: false,
      error: 'Text file is too large (maximum 512 KB).',
    };
  }

  return { ok: true, kind };
}

/**
 * Reconstructs clean, readable resume lines from PDF.js text content items
 * using vertical Y-position shifts and explicit EOL markers.
 */
export function reconstructPdfPageLines(items: PdfTextLikeItem[]): string {
  const lines: string[] = [];
  let currentLine: string[] = [];
  let lastY: number | null = null;

  const flushLine = () => {
    const joined = currentLine
      .join(' ')
      .replace(/\s+/g, ' ')
      .replace(/\s+([,.;:!?])/g, '$1')
      .trim();
    if (joined) {
      lines.push(joined);
    }
    currentLine = [];
  };

  for (const item of items) {
    const text = typeof item.str === 'string' ? item.str : '';
    const y =
      Array.isArray(item.transform) && typeof item.transform[5] === 'number'
        ? item.transform[5]
        : null;

    if (lastY !== null && y !== null && Math.abs(y - lastY) > 4) {
      flushLine();
    }

    const trimmed = text.trim();
    if (trimmed) {
      currentLine.push(trimmed);
    }

    if (y !== null) {
      lastY = y;
    }

    if (item.hasEOL) {
      flushLine();
      lastY = null;
    }
  }

  flushLine();
  return lines.join('\n');
}

export async function extractTextFromPdfArrayBuffer(
  buffer: ArrayBuffer
): Promise<string> {
  const [pdfjsLib, workerModule] = await Promise.all([
    import('pdfjs-dist'),
    import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
  ]);

  if (workerModule?.default) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerModule.default;
  }

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
    useSystemFonts: true,
  });

  let pdfDoc: Awaited<typeof loadingTask.promise> | null = null;

  try {
    pdfDoc = await loadingTask.promise;
    const totalPages = Math.min(pdfDoc.numPages, MAX_PDF_PAGES);
    const pageTexts: string[] = [];

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = reconstructPdfPageLines(
        textContent.items as PdfTextLikeItem[]
      );
      if (pageText) {
        pageTexts.push(pageText);
      }
      page.cleanup();
    }

    const combined = pageTexts.join('\n\n').trim();
    if (!combined) {
      throw new Error(
        'No selectable text was found in this PDF. If it is a scanned image PDF, please copy and paste your resume text directly.'
      );
    }
    return combined;
  } catch (err: unknown) {
    if (
      err &&
      typeof err === 'object' &&
      'name' in err &&
      (err as { name?: string }).name === 'PasswordException'
    ) {
      throw new Error(
        'This PDF is password-protected. Please upload an unlocked PDF or paste your resume text.'
      );
    }
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Could not read the PDF file. Please try another file or paste text directly.');
  } finally {
    await loadingTask.destroy();
  }
}
