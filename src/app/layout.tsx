import type { Metadata } from "next";
import { pretendard } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "남문교회 - 이 땅을 품는 하늘 공동체",
    template: "%s - 남문교회",
  },
  description:
    "남문교회 - 이 땅을 품는 하늘 공동체. 서울시 금천구 독산로 94가길 29. 대한예수교장로회(합신)",
  keywords: ["남문교회", "금천구", "독산동", "교회", "예배", "설교"],
  openGraph: {
    title: "남문교회 - 이 땅을 품는 하늘 공동체",
    description: "남문교회 홈페이지. 서울시 금천구 독산로 94가길 29.",
    siteName: "남문교회",
    locale: "ko_KR",
    type: "website",
    url: "https://nammoon.or.kr",
  },
  metadataBase: new URL("https://nammoon.or.kr"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${pretendard.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
