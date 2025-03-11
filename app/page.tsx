// app/page.tsx
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/main-page"); // /main-page로 리다이렉트
}