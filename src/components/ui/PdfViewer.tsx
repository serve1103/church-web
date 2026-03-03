"use client";

import { useState } from "react";
import { Download, ExternalLink, FileText } from "lucide-react";

interface PdfViewerProps {
  fileUrl: string;
  title: string;
}

const PdfViewer = ({ fileUrl, title }: PdfViewerProps) => {
  const [hasError, setHasError] = useState(false);

  // File URL for inline browser viewing (no ?dl= to avoid attachment disposition)
  const viewUrl = fileUrl;

  return (
    <div className="flex flex-col gap-4">
      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <a
          href={fileUrl}
          download
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          <Download className="h-4 w-4" />
          다운로드
        </a>
        <a
          href={viewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-text transition-colors hover:bg-surface"
        >
          <ExternalLink className="h-4 w-4" />
          새 탭에서 열기
        </a>
      </div>

      {/* PDF iframe viewer */}
      {!hasError ? (
        <div className="relative w-full overflow-hidden rounded-lg border border-border bg-surface">
          <iframe
            src={viewUrl}
            title={title}
            className="h-[60vh] w-full sm:h-[75vh] lg:h-[85vh]"
            onError={() => setHasError(true)}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-border bg-surface px-4 py-16">
          <FileText className="h-16 w-16 text-text-secondary" />
          <p className="text-center text-text-secondary">
            PDF를 표시할 수 없습니다.
            <br />
            아래 버튼을 눌러 다운로드하거나 새 탭에서 확인해주세요.
          </p>
          <div className="flex gap-3">
            <a
              href={fileUrl}
              download
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
            >
              <Download className="h-4 w-4" />
              다운로드
            </a>
            <a
              href={viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-text transition-colors hover:bg-surface"
            >
              <ExternalLink className="h-4 w-4" />
              새 탭에서 열기
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfViewer;
