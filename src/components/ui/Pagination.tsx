import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string>;
}

const Pagination = ({
  currentPage,
  totalPages,
  basePath,
  searchParams = {},
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page > 1) {
      params.set("page", String(page));
    } else {
      params.delete("page");
    }
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const pages: (number | "ellipsis")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("ellipsis");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("ellipsis");
    pages.push(totalPages);
  }

  return (
    <nav className="mt-12 flex items-center justify-center gap-1">
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
      ) : (
        <span className="flex h-10 w-10 items-center justify-center text-gray-300">
          <ChevronLeft className="h-5 w-5" />
        </span>
      )}

      {pages.map((page, i) =>
        page === "ellipsis" ? (
          <span
            key={`e${i}`}
            className="flex h-10 w-10 items-center justify-center text-text-secondary"
          >
            ...
          </span>
        ) : page === currentPage ? (
          <span
            key={page}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-white"
          >
            {page}
          </span>
        ) : (
          <Link
            key={page}
            href={buildHref(page)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-sm text-text-secondary transition-colors hover:bg-surface"
          >
            {page}
          </Link>
        ),
      )}

      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface"
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      ) : (
        <span className="flex h-10 w-10 items-center justify-center text-gray-300">
          <ChevronRight className="h-5 w-5" />
        </span>
      )}
    </nav>
  );
};

export default Pagination;
