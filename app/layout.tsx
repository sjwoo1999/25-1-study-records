// app/layout.tsx
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "2025-1 Timetable",
  description: "Weekly class timetable",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="max-w-5xl mx-auto p-4">
        {children}
      </body>
    </html>
  );
}