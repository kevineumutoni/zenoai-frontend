'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AiOutlineComment } from 'react-icons/ai';
import { HiOutlineUsers } from 'react-icons/hi2';
import { BsBarChart } from 'react-icons/bs';
import { FiDatabase } from 'react-icons/fi';
import { TbActivityHeartbeat } from 'react-icons/tb';
import { LuLayoutDashboard } from 'react-icons/lu';

import Image from 'next/image';

const navItems = [
  { Icon: LuLayoutDashboard , label: 'Dashboard', path: '/usermanagement'  },
  { Icon: TbActivityHeartbeat, label: 'System Health', path: '/usermanagement' },
  { Icon: BsBarChart , label: 'Usage Analytics', path: '/usermanagement' },
  { Icon: AiOutlineComment, label: 'User Feedback', path: '/usermanagement' },
  { Icon: FiDatabase  , label: 'Resource Management', path: '/usermanagement' },
  { Icon: HiOutlineUsers , label: 'User Management', path: '/usermanagement' },
];

export default function SidebarNav() {
const [activeIndex, setActiveIndex] = useState<number>(0);
  const router = useRouter();

  const handleNavigation = (index: number, path: string) => {
    setActiveIndex(index);
    router.push(path);
  };

  return (
    <div>
      <Image src="/images/zeno-logo-icon.png" alt="Zeno Logo" width={70} height={100} className=" mt-10 ml-2" />
      <nav
        className="fixed top-1/2 left-0 transform -translate-y-1/2 flex flex-col bg-cyan-400 rounded-tr-[4rem] rounded-br-[4rem] py-8  items-center gap-10 w-25"
        aria-label="Sidebar navigation"
      >
        {navItems.map(({ Icon, label, path }, i) => {
          const isActive = activeIndex === i;
          return (
            <div
              key={label}
              role="button"
              aria-label={label}
              tabIndex={0}
              data-testid="nav-item"
              className={`relative group cursor-pointer flex items-center justify-center  w-12 h-12 rounded-lg
                ${isActive ? 'text-[#9FF8F8] bg-[#0A1A2E]' : 'text-[#0A1A2E]'}
                hover:text-[#9FF8F8] hover:bg-[#0A1A2E]`}
              onClick={() => handleNavigation(i, path)}
            >
              <Icon size={28}/>
              <span className="absolute left-full top-1/2 ml-10 -translate-y-1/2 whitespace-nowrap rounded-full bg-[#9FF8F8] px-3 py-1 text-lg  text-black opacity-0 group-hover:opacity-100 transition-opacity  pointer-events-none">
                {label}
              </span>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
