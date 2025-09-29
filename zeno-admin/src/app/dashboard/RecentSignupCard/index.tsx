'use client';

import Image from "next/image";
import { useUsers } from "../../hooks/useFetchUsers";
import { FaUserCircle } from "react-icons/fa";

export default function RecentSignupsCard() {
  const { users, loading, error } = useUsers();

  const recentUsers = Array.isArray(users)
    ? users
        .filter(user => user.role === "User")
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 3)
    : [];

  if (loading) {
    return (
      <section className="w-full max-w-[700px] rounded-2xl bg-[#15213B] shadow-xl xl:p-8 p-8 flex items-center justify-center" style={{ minHeight: 300 }}>
        <div className="text-center w-full">
          <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4 animate-spin"></div>
          <p className="text-[#A1B1D6] text-base xl:text-xs">Loading recent signups...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full max-w-[700px] rounded-2xl bg-[#15213B] shadow-xl xl:p-8 p-8 flex items-center justify-center" style={{ minHeight: 300 }}>
        <div className="text-center w-full">
          <div className="bg-red-600 text-white p-4 rounded-lg mb-4 xl:p-2 xl:mb-2">
            <h2 className="text-lg font-bold mb-2 xl:text-base xl:mb-1">Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-[780px] 2xl:rounded-2xl xl:rounded-lg bg-[#15213B] shadow-xl xl:p-4  lg:p-2" style={{ minHeight: 100 }}>
      <h2 className="2xl:text-4xl xl:text-2xl font-semibold text-white 2xl:mb-2 xl:mb-2">Recent Signups</h2>
      <p className="2xl:text-lg xl:text-base text-white 2xl:mb-7 xl:mb-4 mb-6">Most recent Signups</p>
      <ul className="2xl:space-y-6 xl:space-y-4">
        {recentUsers.map((user) => (
          <li key={user.id} className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-[#A1B1D6] flex-shrink-0 overflow-hidden xl:w-10 xl:h-10 lg:w-8 lg:h-8">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={`${user.first_name} ${user.last_name}`}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover xl:w-10 xl:h-10 lg:w-8 lg:h-8"
                />
              ) : (
                <FaUserCircle size={48} color="#A1B1D6" className="xl:w-10 xl:h-10 lg:w-8 lg:h-8" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-white xl:text-lg 2xl:text-xl">
                {user.first_name} {user.last_name}
              </span>
              <span className="xl:text-base 2xl:text-lg">
                {user.email}
              </span>
            </div>
            <span className="ml-auto xl:text-base 2xl:text-lg">
              {new Date(user.created_at).toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}