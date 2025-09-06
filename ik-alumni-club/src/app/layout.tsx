import type { Metadata } from "next";
import localFont from 'next/font/local';
import "./globals.css";

const academyFont = localFont({
  src: '../../public/fonts/Academy.ttf',
  weight: '400',
  variable: '--font-academy',
  display: 'swap',
});

const academyFilled3D = localFont({
  src: '../../public/fonts/AcademyFilled3D.ttf',
  weight: '700',
  variable: '--font-academy-3d',
  display: 'swap',
});

// 日本語フォント（Senobi Gothic）
const senobiGothic = localFont({
  src: [
    {
      path: '../../public/fonts/Senobi-Gothic-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Senobi-Gothic-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Senobi-Gothic-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-senobi',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "IK Alumni Club",
  description: "IK Alumni CGT サポーターズクラブ会員サイト",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${academyFont.variable} ${academyFilled3D.variable} ${senobiGothic.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
