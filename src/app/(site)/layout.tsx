import { draftMode } from "next/headers";
import { SanityLive } from "@/sanity/lib/live";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import VisualEditingWrapper from "@/components/ui/VisualEditingWrapper";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDraftMode = (await draftMode()).isEnabled;

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <SanityLive />
      {isDraftMode && <VisualEditingWrapper />}
    </>
  );
}
