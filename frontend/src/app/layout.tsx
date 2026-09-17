import type { Metadata } from "next";
import { Manrope, Noto_Sans_JP, Roboto_Mono } from "next/font/google";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import Toast from "@/components/toast";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const siteUrl = "https://civicai-summit-2027.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CivicAI Summit 2027 | GDGoC KIT",
    template: "%s | CivicAI Summit 2027",
  },
  description:
    "AI・LLM技術で地域課題を突破する、産官学民オープンイノベーション。2027年9月18日(土)〜19日(日)、石川県金沢市で開催予定。GDGoC KIT 主催。",
  openGraph: {
    title: "CivicAI Summit 2027",
    description:
      "AI・LLM技術で地域課題を突破する、産官学民オープンイノベーション。2027年9月18日(土)〜19日(日)、石川県金沢市で開催予定。GDGoC KIT 主催。",
    url: siteUrl,
    siteName: "CivicAI Summit 2027",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ja"
      className={`${manrope.variable} ${notoSansJP.variable} ${robotoMono.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Toast />
      </body>
    </html>
  );
}
