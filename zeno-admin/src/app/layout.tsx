'use client';

import "./globals.css";
import { Teachers } from "next/font/google";
import { usePathname } from "next/navigation";
import SidebarNav from "./sharedComponents/Navigation";
import ProfileMenu from "./sharedComponents/ProfileMenu";
import useFetchAdmins from "./hooks/useFetchAdmin"; 

const teachers = Teachers({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-teachers",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, error } = useFetchAdmins();
  const pathname = usePathname();
  const hideSidebarPaths = ["/", "/welcome", "/signin"];
  const showSidebar = !hideSidebarPaths.includes(pathname);

  const hideProfileMenuPaths = ["/", "/welcome", "/signin"];
  const showProfileMenu = !hideProfileMenuPaths.includes(pathname);

  const profileImage = user?.image || "/images/zeno-logo.png";

  return (
    <html lang="en">
      <body className={`${teachers.variable} antialiased`}>
        <div className="flex min-h-screen">
          {showSidebar && <SidebarNav />}
          <div className="flex-1 flex flex-col">
            {showProfileMenu && (
              <div className="flex items-center justify-end px-8 mt-3 w-full">
                <ProfileMenu image={profileImage} />
              </div>
            )}
            <main>{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
