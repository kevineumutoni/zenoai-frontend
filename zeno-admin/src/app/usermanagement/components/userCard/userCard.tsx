'use client';
import { useUserStats } from "../../../hooks/totalusers";
import { HiOutlineUsers } from "react-icons/hi2";



interface UserCardProps {
  total_users: number;
  new_users: number;
}

function UserCard({ total_users, new_users }: UserCardProps) {
  return (
    <div className="user-card p-4 rounded-lg bg-[#D9D9D9] text-black w-64 shadow-md  ml-70 mt-20">
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

  if (loading) return <p>Loading user stats...</p>;
  if (error) return <p>Error loading user stats: {error}</p>;

  return <UserCard total_users={total_users} new_users={new_users} />;
}
