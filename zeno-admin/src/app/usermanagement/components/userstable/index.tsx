'use client';

import React, { useState, useMemo } from "react";
import { useUsers } from "../../../hooks/usefetchUsers";
import { FaUserCircle } from "react-icons/fa";
import dayjs from "dayjs";

export default function UsersTable() {
  const { users, loading, error } = useUsers();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const roles = useMemo(
    () =>
      Array.from(new Set(users.map((u) => u.role))).filter(Boolean),
    [users]
  );

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.first_name.toLowerCase().includes(search.toLowerCase()) ||
        user.last_name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole =
        roleFilter === "all" ? true : user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  if (loading) return <div className="text-teal-400 text-center"><p>Loading users...</p></div>;
  if (error) return <div className="text-red-500 text-center"><p>Error loading users: {error}</p></div>;

  return (
    <div className="mx-20">
      <div className="flex gap-4 mb-4 mt-10 items-center ml-50">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded border border-gray-400 w-72"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-gray-50 text-black border border-gray-400 rounded p-2 focus:border-blue-500"
        >
          <option value="all">All Roles</option>
          {roles.map((role) => (
            <option value={role} key={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </option>
          ))}
        </select >
      </div>
      <div className="overflow-auto max-h-[450px] shadow-md border-2 border-gray-600 rounded-md w-[65vw] ml-50 mt-6">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-[#091326]">
            <tr>
              <th className="p-2 w-[350px] text-white text-left text-2xl font-bold">Users</th>
              <th className="p-2 w-[350px] text-white text-left text-2xl font-bold">Role</th>
              <th className="p-2 w-[150px] text-white text-left text-2xl">Sign up date</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-white p-2 text-center">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-700 last:border-none hover:bg-gray-800"
                >
                  <td className="p-1 ">
                    <div className="flex items-center gap-3 ">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={`${user.first_name} ${user.last_name}`}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <FaUserCircle size={50} color="#9FF8F8" />
                      )}

                      <div className="ml-5">
                        <div className="text-teal-400 text-[22px] ">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-[18px] text-white">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="text-white text-2xl ml-2">
                      {user.role}
                    </div>
                  </td>
                  <td className="p-2 text-white text-[20px] ">
                    {dayjs(user.created_at).format("YYYY-MM-DD")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}