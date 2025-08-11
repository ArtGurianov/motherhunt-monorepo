import "./variables.css";
import "@shared/ui/globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getAppLocale } from "@shared/ui/lib/utils";
import { Toaster } from "@shared/ui/components/sonner";
import { APP_LOCALE_TO_LANG_MAP } from "@shared/ui/lib/utils";
import { AppProviders } from "@/components/AppProviders/AppProviders";
import { Navbar } from "@/components/Navbar/Navbar";
import { CameraBg } from "@/components/CameraBg/CameraBg";
import { NextIntlClientProvider } from "next-intl";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import getConfig from "next/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MotherHunt",
  description:
    "A web3 auction platfrom for fashion street scouters and boutique mother agencies.",
};

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie");
  const initialState = cookieToInitialState(getConfig(), cookieHeader);
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
            <AppProviders initialState={initialState}>
              <div className="flex flex-col min-h-content justify-start items-center gap-6 px-4 mb-12">
                {modal}
                {children}
              </div>
              <Navbar />
            </AppProviders>
          </NextIntlClientProvider>
        </main>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
