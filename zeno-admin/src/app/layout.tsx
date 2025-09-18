'use client';

import "./globals.css";
import { Teachers } from "next/font/google";
import { usePathname } from "next/navigation";
import SidebarNav from "./sharedComponents/Navigation";
import CalendarDropdown from "./sharedComponents/CalendarDropdown";

const teachers = Teachers({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-teachers",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideSidebarPaths = ["/", "/welcome", "/signin"];
  const showSidebar = !hideSidebarPaths.includes(pathname);

  const handleDateChange = (start: Date | null, end: Date | null) => {
  };

  return (
    <html lang="en">
      <body className={`${teachers.variable} antialiased`}>
        <div className="flex flex-col min-h-screen">
          {/* <header className=" ">
            <CalendarDropdown onDateChange={handleDateChange} />
          </header> */}
          <div className="flex flex-1">
            {showSidebar && <SidebarNav />}
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
