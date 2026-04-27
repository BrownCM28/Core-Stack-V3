import type { Metadata } from "next";
import localFont from "next/font/local";
import { Navbar } from "@/components/Navbar";
import { PendingApplicationHandler } from "@/components/PendingApplicationHandler";
import "./globals.css";

const satoshi = localFont({
  src: [
    {
      path: "../Fonts/Satoshi_Complete/Fonts/WEB/fonts/Satoshi-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../Fonts/Satoshi_Complete/Fonts/WEB/fonts/Satoshi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../Fonts/Satoshi_Complete/Fonts/WEB/fonts/Satoshi-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../Fonts/Satoshi_Complete/Fonts/WEB/fonts/Satoshi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../Fonts/Satoshi_Complete/Fonts/WEB/fonts/Satoshi-Variable.woff2",
      weight: "300 900",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

const alliance = localFont({
  src: "../Fonts/Alliance_No_2_Regular.otf",
  variable: "--font-alliance",
  weight: "400",
  display: "swap",
});

const wavehaus = localFont({
  src: [
    {
      path: "../Fonts/graham-paterson-wavehaus-typeface/Wavehaus-42Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../Fonts/graham-paterson-wavehaus-typeface/Wavehaus-66Book.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../Fonts/graham-paterson-wavehaus-typeface/Wavehaus-95SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../Fonts/graham-paterson-wavehaus-typeface/Wavehaus-128Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-wavehaus",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CoreStack — Data Center & AI Infrastructure Jobs",
    template: "%s | CoreStack",
  },
  description:
    "The job board for data center construction, operations, and AI infrastructure professionals.",
  keywords: [
    "data center jobs",
    "AI infrastructure",
    "data center construction",
    "colocation",
    "hyperscale",
    "critical facilities",
  ],
  openGraph: {
    title: "CoreStack — Data Center & AI Infrastructure Jobs",
    description:
      "The job board for data center construction, operations, and AI infrastructure professionals.",
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
      lang="en"
      className={`${satoshi.variable} ${alliance.variable} ${wavehaus.variable}`}
    >
      <body className="min-h-screen text-text-primary antialiased">
        <Navbar />
        <main className="pt-[80px]">{children}</main>
        <PendingApplicationHandler />
      </body>
    </html>
  );
}
