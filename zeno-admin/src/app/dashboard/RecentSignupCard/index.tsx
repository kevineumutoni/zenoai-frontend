'use client';

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
      <section className="rounded-2xl bg-[#15213B] shadow-xl w-full p-8 xl:px-8 xl:py-8 flex items-center justify-center" style={{ minHeight: 200 }}>
        <div className="text-center w-full">
          <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4 animate-spin"></div>
          <p className="text-[#A1B1D6] text-base">Loading recent signups...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl bg-[#15213B] shadow-xl w-full p-8 xl:px-8 xl:py-8 flex items-center justify-center" style={{ minHeight: 200 }}>
        <div className="text-center w-full">
          <div className="bg-red-600 text-white p-4 rounded-lg mb-4">
            <h2 className="text-lg font-bold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl bg-[#15213B] shadow-xl w-full p-8 xl:px-8 xl:py-8">
      <h2 className="2xl:text-4xl lg:text-2xl font-semibold text-white mb-2">
        Recent Signups
      </h2>
      <p className="2xl:text-lg lg:text-base text-white mb-6 ">
        Most recent Signups
      </p>
      <ul className="2xl:space-y-6 lg:space-y-4">
        {recentUsers.map((user) => (
          <li key={user.id} className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-[#A1B1D6] flex-shrink-0 overflow-hidden">
              {user.image ? (
                <img
                  src={user.image}
                  alt={`${user.first_name} ${user.last_name}`}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <FaUserCircle size={48} color="#A1B1D6" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-white lg:text-lg 2xl:text-xl">
                {user.first_name} {user.last_name}
              </span>
              <span className="lg:text-base 2xl:text-lg">
                {user.email}
              </span>
            </div>
            <span className="ml-auto lg:text-base 2xl:text-lg">
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