import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { siteCongig } from "@/config/site";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: siteCongig.name,
    template: `%s | ${siteCongig.name}`
  },
  description: siteCongig.description,
  /* Este icon es el favicon */
  icons: [
    {
      url: "/logo.svg",
      href: "/logo.svg",
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
