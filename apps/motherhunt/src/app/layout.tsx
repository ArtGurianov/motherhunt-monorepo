import "./variables.css";
import "@shared/ui/globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/Navbar/Navbar";
import { Footer } from "@/components/Footer/Footer";
import { getAppLocale } from "@shared/ui/lib/utils";
import { APP_LOCALE_TO_LANG_MAP } from "@shared/ui/lib/utils";
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = getAppLocale();
  const lang = APP_LOCALE_TO_LANG_MAP[locale];

  return (
    <html lang={lang}>
      <body
        className={`flex flex-col items-center ${geistSans.variable} ${geistMono.variable} overflow-x-clip antialiased`}
      >
        <NextIntlClientProvider>
          <Navbar />
          <main className="flex flex-col min-h-content w-full">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
