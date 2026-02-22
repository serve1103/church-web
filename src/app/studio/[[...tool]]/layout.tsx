import Link from "next/link";

export default function StudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="flex h-9 shrink-0 items-center bg-[#111827] px-4">
        <Link
          href="/"
          className="text-sm text-gray-400 transition-colors hover:text-white"
        >
          ← 사이트 보기
        </Link>
      </div>
      <div className="relative min-h-0 flex-1 [&>div]:!h-full">{children}</div>
    </div>
  );
}
