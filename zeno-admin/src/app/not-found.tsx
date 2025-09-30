'use client';


import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


export default function NotFound() {
 const router = useRouter();


 useEffect(() => {
   const sidebar = document.querySelector('.sidebar-nav');
   if (sidebar) sidebar.setAttribute('style', 'display: none !important;');
   const profile = document.querySelector('[data-profile-menu]');
   if (profile) profile.setAttribute('style', 'display: none !important;');


   return () => {
     if (sidebar) sidebar.removeAttribute('style');
     if (profile) profile.removeAttribute('style');
   };
 }, []);


 return (
   <div
     style={{ zIndex: 99999, position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: '#0A1A2E' }}
     className="flex flex-col items-center justify-center min-h-screen bg-[#0A1A2E]"
   >
     <Image
       src="/images/robot.png"
       alt="Robot"
       width={160}
       height={160}
       className="animate-waving mb-8"
       priority
     />
     <h1 className="text-5xl font-bold text-[#9FF8F8] mb-4">Oops!</h1>
     <p className="text-2xl text-white mb-2">Page not found</p>
     <p className="text-lg text-[#A1B1D6] mb-8">Sorry, the page you’re looking for doesn’t exist.</p>
     <button
       className="bg-[#9FF8F8] text-[#0A1A2E] font-bold px-8 py-3 rounded-full hover:bg-[#22d3ee] transition"
       onClick={() => router.push('/landing_page')}
     >
       Go back home
     </button>
   </div>
 );
}



