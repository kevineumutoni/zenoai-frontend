'use client';
import "./globals.css";
import { Teachers } from "next/font/google";
import { usePathname } from "next/navigation";
import SidebarNav from "./sharedComponents/Navigation";
const teachers = Teachers({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-teachers",
});
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSidebarPaths = ["/", "/welcome", "/signin"];
  const showSidebar = !hideSidebarPaths.includes(pathname);
  return (
    <html lang="en" >
      <body  className={`${teachers.variable} antialiased`}>
        <div className="flex min-h-screen">
          {showSidebar && <SidebarNav />}
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}