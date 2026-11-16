import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "パチスロ設定判別ツール",
    template: "%s | パチスロ設定判別ツール",
  },
  description: "ホールで片手でカウントできるパチスロ設定判別ツール",
  // ホーム画面に追加したときのアプリ名（Android は app/manifest.ts、iPhone はここ）
  applicationName: "設定推測",
  appleWebApp: {
    capable: true,
    title: "設定推測",
    statusBarStyle: "black",
  },
};

/** スマホのブラウザ上部の色（アプリの背景と同じ色） */
export const viewport: Viewport = {
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* suppressHydrationWarning: ブラウザ拡張機能（ColorZilla など）が body に属性を足しても警告を出さない */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
