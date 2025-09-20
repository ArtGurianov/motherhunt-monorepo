import "./variables.css";
import "@shared/ui/globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getAppLocale } from "@shared/ui/lib/utils";
import { APP_LOCALE_TO_LANG_MAP } from "@shared/ui/lib/utils";
import { AppProviders } from "@/components/AppProviders/AppProviders";
import { Navbar } from "@/components/Navbar/Navbar";
import { CameraBg } from "@/components/CameraBg/CameraBg";
import { NextIntlClientProvider } from "next-intl";
import { Suspense } from "react";
import { AppToaster } from "@/components/AppProviders/AppToaster";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MotherHunt",
  description:
    "A web3 auction platfrom for fashion street scouters and boutique mother agencies.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = getAppLocale();
  const lang = APP_LOCALE_TO_LANG_MAP[locale];

  return (
    <html lang={lang}>
      <body
        className={`relative ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CameraBg />
        <main className="relative min-h-svh pt-8">
          <NextIntlClientProvider>
            <AppProviders>
              <div className="flex flex-col min-h-content justify-start items-center gap-6 px-4 mb-12">
                {children}
              </div>
              <Navbar />
            </AppProviders>
            <Suspense>
              <AppToaster />
            </Suspense>
          </NextIntlClientProvider>
        </main>
      </body>
    </html>
  );
}
