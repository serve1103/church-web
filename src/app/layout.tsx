import type { Metadata } from "next";
import { pretendard } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "남문교회",
  description: "남문교회 홈페이지",
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
