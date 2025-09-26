'use client'
import DashboardTopBar from "./components/TopBar";
import DashboardMain from "./components/MainPage";


export default function DashboardPage() {
 return (
   <main className="relative min-h-screen">
     <DashboardTopBar />
     <DashboardMain />
   </main>
 );
}
