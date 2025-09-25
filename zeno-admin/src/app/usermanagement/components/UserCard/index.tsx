'use client';
import { useUserStats } from "../../../hooks/useFetchTotalUsers";
import { HiOutlineUsers } from "react-icons/hi2";

interface UserCardProps {
  total_users: number;
  new_users: number;
}

function UserCard({ total_users, new_users }: UserCardProps) {
  return (
    <div className="user-card p-4 rounded-lg bg-[#D9D9D9] text-black w-64 shadow-md  ml-40 mt-10">
      <div className="flex items-center justify-between mb-2 text-3xl ">
        <p className=" ">Total Users</p>
        <HiOutlineUsers />
      </div>
      <p className="text-3xl ">{total_users}</p>
      <div className="mt-2">
        <p className="text-[#3F944E] text-[18px]">+{new_users} this week</p>
      </div>
    </div>
  );
}

export default function UserStatsContainer() {
  const { total_users, new_users, loading, error } = useUserStats();

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[180px] w-full">
        <div className="rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500 mb-2 animate-spin"></div>
        <p className="text-[#A1B1D6] text-base">Loading user stats...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[180px] w-full">
        <div className="text-red-500 text-base">Error loading user stats: {error}</div>
      </div>
    );

  return <UserCard total_users={total_users} new_users={new_users} />;
}