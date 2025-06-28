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

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const locale = getAppLocale();
  const lang = APP_LOCALE_TO_LANG_MAP[locale];

  return (
    <html lang={lang}>
      <body
        className={`flex flex-col items-center ${geistSans.variable} ${geistMono.variable} overflow-x-clip antialiased`}
      >
        <CameraBg />
        <main className="relative flex flex-col min-h-svh w-full pt-8">
          <NextIntlClientProvider>
            <AppProviders>
              <div className="flex flex-col min-h-content w-full justify-center items-center">
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
