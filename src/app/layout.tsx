import type { Metadata } from "next";
import { Sirin_Stencil, Inter } from "next/font/google";
import "./globals.css";

const sirin = Sirin_Stencil({
  weight: "400",
  variable: "--font-sirin",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CanineCorp",
  description: "Meet your new masters.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sirin.variable} ${inter.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col font-sans bg-black text-white selection:bg-cyan-500/30 selection:text-cyan-200">{children}</body>
    </html>
  );
}
