import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import { AuthProvider } from "./auth/authContext";
import "./globals.css";

const notoSansTC = Noto_Sans_TC({
  display: "swap", // 字體載入前先用系統字體
  preload: false,
});

export const metadata: Metadata = {
  title: "長青宿舍",
  description: "長青宿舍提供安全、舒適、設備齊全的住宿環境，鄰近校園交通便利，只提供給女性租屋。",
  keywords: ["長青宿舍", "學生宿舍", "學生租屋", "學校住宿", "安全宿舍", "女生宿舍"],
   openGraph: {
    title: "長青宿舍｜學生最佳住宿選擇 ",
    description: "安全、舒適、近校園的理想宿舍空間，只提供給女性租屋。",
    url: "http://localhost:3000", // 要記得換成正式上線後的網址
    siteName: "長青宿舍",
    images: [
      {
        url: "http://localhost:3000/og-image.jpg", // 要記得換成實際的圖片網址
        width: 1200,
        height: 630,
        alt: "長青宿舍",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <head>
      </head>
      <body className={notoSansTC.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
