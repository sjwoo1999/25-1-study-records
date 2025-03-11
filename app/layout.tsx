// app/main-page/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {/* 전역으로 필요한 요소들 예: Nav, Footer */}
        {children}
      </body>
    </html>
  );
}
