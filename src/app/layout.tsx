import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bridge — YTÜ Blockchain",
  description:
    "YTÜ Blockchain Topluluğu için hackathon katılım platformu: topluluk, hackathonlar, projeler ve takım kurma.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={cn("h-full antialiased font-sans", sans.variable, mono.variable)}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}



