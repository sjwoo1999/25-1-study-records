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
      <body className={`${notoSansKR.className} bg-gray-100 flex items-center justify-center min-h-screen p-4`}>
        <div className="max-w-5xl w-full bg-white shadow-md rounded-lg p-6">
          {children}
        </div>
      </body>
    </html>
  );
}
