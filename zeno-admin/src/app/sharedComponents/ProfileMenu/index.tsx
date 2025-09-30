'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaUserCircle } from 'react-icons/fa';

const ProfileMenu = ({ image }: { image?: string }) => {
  const [open, setOpen] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowLogoutPopup(false);
      }
    }
    if (open || showLogoutPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, showLogoutPopup]);

  const handleProfile = () => {
    setOpen(false);
    router.push('/profile');
  };

  const handleLogout = () => {
    setOpen(false);
    setShowLogoutPopup(true);
  };

  const confirmLogout = () => {
    setShowLogoutPopup(false);
    localStorage.clear();
    router.push('/signin');
  };

  const cancelLogout = () => {
    setShowLogoutPopup(false);
  };

  return (
    <div className="relative mt-10" ref={menuRef}>
      {
        image?
        <Image
        src={image}
        alt="Profile"
        width={48}
        height={48}
        className="w-12 h-12 rounded-full border-2 border-cyan-400 cursor-pointer"
        onClick={() => setOpen(o => !o)}
        style={{ objectFit: "cover" }}
      /> : (
          <FaUserCircle
            size={48}
            className="w-12 h-12 rounded-full border-2 border-cyan-400 cursor-pointer"
            color="#9FF8F8"
          />)
      }

      
      
      {open && (
        <div
          className="absolute right-0 mt-4 z-50 bg-white/95 rounded-xl shadow-xl overflow-hidden min-w-[140px]"
          style={{ border: "2px solid #D6EAF8" }}
        >
          <button
            onClick={handleProfile}
            className="flex items-center gap-2 px-5 py-3 w-full text-left text-gray-800 hover:bg-cyan-500 focus:bg-cyan-100 transition-colors"
            style={{ borderBottom: "1px solid #D6EAF8" }}
          >
            <span>
              <svg width="22" height="22" fill="none" stroke="#0F243D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/></svg>
            </span>
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-3 w-full text-left text-cyan-700 hover:bg-cyan-500 focus:bg-cyan-50 transition-colors"
          >
            <span>
              <svg width="22" height="22" fill="none" stroke="#00C8C8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 2v10"/><circle cx="12" cy="12" r="10"/></svg>
            </span>
            Log out
          </button>
        </div>
      )}
      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div
            ref={popupRef}
            className="bg-white/95 rounded-xl shadow-xl p-4 sm:p-6 max-w-sm w-full"
            style={{ border: "2px solid #D6EAF8" }}
          >
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelLogout}
                className="px-3 sm:px-4 py-2 text-red-400 hover:text-red-300 transition-colors cursor-pointer text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-3 sm:px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer text-sm sm:text-base"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;