import { Header } from "@/components/shared/header/Header";

import SiteFooter from "@/components/shared/footer/site-footer";
import { DomainChangeAlert } from "@/components/domain-change-alert";

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
      {/* <DomainChangeAlert/> */}
      <SiteFooter />
    </>
  );
}
