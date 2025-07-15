import "./variables.css";
import "@shared/ui/globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist, Geist_Mono, Sono } from "next/font/google";
import { Navbar } from "@/components/Navbar/Navbar";
import { Footer } from "@/components/Footer/Footer";
import { getAppLocale } from "@shared/ui/lib/utils";
import { APP_LOCALE_TO_LANG_MAP } from "@shared/ui/lib/utils";
import { NextIntlClientProvider } from "next-intl";
import { SteamPunkBackgroundFilter } from "@/components/Filters/SteamPunkBackgroundFilter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dynaPuff = Sono({
  variable: "--font-dyna-puff",
  subsets: ["latin"],
  weight: "500",
});

const steampunkTitle = localFont({
  src: "../fonts/SteampunkTitle.ttf",
  variable: "--font-steampunk-title",
});

export const metadata: Metadata = {
  title: "MotherHunt",
  description:
    "A web3 auction platfrom for fashion street scouters and boutique mother agencies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = getAppLocale();
  const lang = APP_LOCALE_TO_LANG_MAP[locale];

  return (
    <html lang={lang}>
      <body
        className={`relative ${geistSans.variable} ${geistMono.variable} ${steampunkTitle.variable} ${dynaPuff.variable} overflow-x-clip antialiased`}
      >
        <main className="relative flex flex-col min-h-svh w-full">
          <NextIntlClientProvider>
            <Navbar />
            <div className="flex flex-col min-h-content w-full justify-start items-center gap-12">
              {children}
            </div>
            <Footer />
          </NextIntlClientProvider>
        </main>
        <SteamPunkBackgroundFilter />
      </body>
    </html>
  );
}
