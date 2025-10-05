import { Header } from "@/components/shared/header/Header";

import SiteFooter from "@/components/shared/footer/site-footer";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        {children}

        <div className="h-16 md:hidden" />
      </div>
      <SiteFooter />
    </>
  );
}
