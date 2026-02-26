import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { SanityLive } from "@/sanity/lib/live";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <SanityLive />
      {(await draftMode()).isEnabled && <VisualEditing zIndex={40} />}
    </>
  );
}
