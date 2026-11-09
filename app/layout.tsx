import type { Metadata } from "next";
import { IBM_Plex_Serif } from "next/font/google";
import { config } from "@fortawesome/fontawesome-svg-core";
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

export const metadata: Metadata = { title: { template: "%s | Newsroom", default: "Newsroom" }, description: "A simple tool to compile things for a newsroom!" };
const ibmPlexSerif = IBM_Plex_Serif({ subsets: ["latin"], weight: "400" })

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${ibmPlexSerif.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
