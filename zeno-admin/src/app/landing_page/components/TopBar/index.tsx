'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlayCircle } from "lucide-react";
import { MdConstruction } from "react-icons/md";


export default function DashboardTopBar() {
 const router = useRouter();
 const [showComingSoon, setShowComingSoon] = useState(false);


 return (
   <>
     <div className="fixed top-0 left-0 w-full flex flex-row items-center justify-between px-2 sm:px-4 md:px-8 py-3 z-50   ">
       <div className="flex-1 flex items-center">
         <button
           className="flex items-center text-cyan-500 hover:text-cyan-400 transition-colors text-sm md:text-base font-medium whitespace-nowrap"
           onClick={() => setShowComingSoon(true)}
         >
           <PlayCircle className="mr-2" size={20} />
           User Guide
         </button>
       </div>
       <div className="flex items-center gap-x-2 md:gap-x-4">
         <button
           className="bg-cyan-500 text-[#0B182F] font-semibold px-3 md:px-5 py-2 rounded-full border border-cyan-900 hover:bg-cyan-800 hover:text-white transition-colors text-xs md:text-sm whitespace-nowrap cursor-pointer"
           onClick={() => router.push("/signin")}
         >
           Sign in
         </button>
         <button
           className="text-cyan-500 font-semibold px-3 md:px-5 py-2 rounded-full border border-cyan-500 hover:bg-cyan-800 hover:text-white transition-colors text-xs md:text-sm whitespace-nowrap cursor-pointer"
           onClick={() => router.push("/signup")}
         >
           Sign up
         </button>
       </div>
     </div>
     {showComingSoon && (
       <div className="fixed inset-0 z-[100] flex items-center justify-center bg-transparent backdrop-brightness-50">
         <div className="relative flex flex-col items-center bg-white border-2 border-[#0B182F] shadow-xl rounded-2xl px-6 py-6 md:px-10 md:py-8 w-[90vw] max-w-xs md:max-w-md">
           <MdConstruction size={44} className="text-cyan-900/80 mb-2" />
           <span className="text-lg md:text-xl font-bold text-cyan-900 mb-1">Coming soon</span>
           <span className="text-black mb-2 text-center">Exciting updates are on the way.</span>
           <button
             className="mt-4 text-[#0B182F] bg-cyan-400 hover:bg-cyan-800 hover:text-white px-5 py-2 font-medium rounded-full transition-colors border-none shadow text-sm md:text-base"
             onClick={() => setShowComingSoon(false)}
           >
             Close
           </button>
         </div>
       </div>
     )}
   </>
 );
}
