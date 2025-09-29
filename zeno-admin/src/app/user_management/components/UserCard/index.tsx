'use client';
import { useUserStats } from "../../../hooks/useFetchTotalUsers";
import { HiOutlineUsers } from "react-icons/hi2";

interface UserCardProps {
  total_users: number;
  new_users: number;
}

function UserCard({ total_users, new_users }: UserCardProps) {
  return (
    <div className="user-card xl:p-3 lg:p-2 lg:mt-2  rounded-lg bg-[#D9D9D9] text-black 2xl:w-64 xl:w-50 lg:w-40 shadow-md  ml-40 2xl:mt-10 xl:mt-5">
      <div className="flex items-center justify-between 2xl:mb-2 2xl:text-3xl xl:text-2xl">
        <p className=" ">Total Users</p>
        <HiOutlineUsers />
      </div>
      <p className="2xl:text-3xl xl:text-2xl ">{total_users}</p>
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