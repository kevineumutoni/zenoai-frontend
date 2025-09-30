
'use client';
import "./globals.css";
import { Teachers } from "next/font/google";
import { usePathname } from "next/navigation";
import SidebarNav from "./sharedComponents/Navigation";
import ProfileMenu from "./sharedComponents/ProfileMenu";
import useFetchAdmins from "./hooks/useFetchAdmin";
import Background from "./sharedComponents/Background";


const teachers = Teachers({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-teachers",
});


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { user } = useFetchAdmins();
  const pathname = usePathname();


  const hideSidebarPaths = ["/", "/welcome", "/signin", "/landing_page", "/signup", "/chat", "/teaser", "/profile", "/not_found"];
  const showSidebar = !hideSidebarPaths.includes(pathname);
  const hideProfileMenuPaths = ["/", "/welcome", "/signin", "/landing_page", "/signup", "/chat", "/teaser", "/profile", "/not_found"];
  const showProfileMenu = !hideProfileMenuPaths.includes(pathname);


  const profileImage = user?.image || "/images/zeno-logo.png";


  return (
    <html lang="en">
      <body className={`${teachers.variable} antialiased`}>
        <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none">
          <Background />
        </div>
        <div className="flex min-h-screen">
          {showSidebar && <SidebarNav />}
          <div className="flex-1 flex flex-col">
            {showProfileMenu && (
              <div className="absolute top-[-8] right-10 z-30">
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

