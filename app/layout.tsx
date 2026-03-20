import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
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
      className={`${inter.variable} ${ibmPlexMono.variable}`}
    >
      <body className="min-h-screen bg-background text-text-primary antialiased">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
