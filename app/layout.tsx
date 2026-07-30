import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/src/providers/ThemeProvider";
import { publicProfile } from "@/src/data/publicProfile";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${publicProfile.name.zh} | CV / VIO / SLAM 算法工程师`,
  description: `${publicProfile.name.zh}的个人技术主页 — CV / VIO / SLAM 算法工程师，专注边缘端 AI 部署与 Next.js 全栈开发。${publicProfile.name.en}'s portfolio.`,
  openGraph: {
    title: `${publicProfile.name.zh} | AI 算法工程师`,
    description: "CV · VIO · SLAM · Edge AI Deployment · Next.js Full-Stack",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
