import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";

import { Toaster } from "@/components/ui/sonner";
import { getWebsiteUrl } from "@/lib/site";
import { MobileBottomNav } from "@/components/shared/MobileBottomNav";
import QueryProvider from "@/providers/query-provider";
import { ImpersonationProvider } from "@/providers/impersonate-provider";
import ImpersonationAlert from "@/components/impersonation-alert";

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Blockechange";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${appName} – Secure & Simple Digital Asset Exchange`,
  description:
    `${appName} is a secure and user-friendly platform for trading and exchanging digital assets, built to make blockchain technology accessible to everyone.`,
  openGraph: {
    type: "website",
    url: getWebsiteUrl(),
    title: `${appName} – Secure & Simple Digital Asset Exchange`,
    description:
      `${appName} is a secure and user-friendly platform for trading and exchanging digital assets, built to make blockchain technology accessible to everyone.`,
    images: [
      {
        url: `${getWebsiteUrl().replace(/\/$/, "")}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${appName} logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${appName} – Secure & Simple Digital Asset Exchange`,
    description:
      `${appName} is a secure and user-friendly platform for trading and exchanging digital assets, built to make blockchain technology accessible to everyone.`,
    images: [`${getWebsiteUrl().replace(/\/$/, "")}/og-image.png`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ImpersonationProvider>
            <QueryProvider>
              <ImpersonationAlert />
              {children}
              <MobileBottomNav />
              <Toaster expand={true} />
            </QueryProvider>
          </ImpersonationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
