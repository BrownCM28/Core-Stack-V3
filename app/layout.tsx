import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { PendingApplicationHandler } from "@/components/PendingApplicationHandler";
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
      <body
        className="min-h-screen text-text-primary antialiased"
        style={{
          background: `
            radial-gradient(ellipse 70% 55% at 0% 0%, rgba(62, 207, 142, 0.12) 0%, transparent 60%),
            radial-gradient(ellipse 70% 55% at 100% 0%, rgba(99, 130, 245, 0.09) 0%, transparent 60%),
            radial-gradient(ellipse 60% 35% at 50% 18%, rgba(62, 207, 142, 0.05) 0%, transparent 50%),
            #FFFFFF
          `,
        }}
      >
        <Navbar />
        <main>{children}</main>
        <PendingApplicationHandler />
      </body>
    </html>
  );
}
