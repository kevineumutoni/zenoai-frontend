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
  const { user, loading, error } = useFetchAdmins();
  const pathname = usePathname();

  const hideSidebarPaths = ["/", "/welcome", "/signin","/landing_page", "/signup","/chat"];
  const hideChatInputPaths = ["/","/signin", "/welcome","/analytics","/systemHealth","/user_reviews","/usermanagement",,"/landing_page","/signup","/dashboard","/profile", "/signup","/chat"];


  const showSidebar = !hideSidebarPaths.includes(pathname);

  const hideProfileMenuPaths = ["/", "/welcome", "/signin","/landing_page", "/signup","/chat"];
  const showProfileMenu = !hideProfileMenuPaths.includes(pathname);
  const showChatInput = !hideChatInputPaths.includes(pathname);

  const handleRunCreated = (run: any) => {
    console.log("Run created:", run);
  };

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
