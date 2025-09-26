'use client'
import React, { useState, useMemo, useRef, useEffect } from "react";
import { useUsers } from "../../../hooks/useFetchUsers";
import { FaUserCircle } from "react-icons/fa";
import dayjs from "dayjs";
import CalendarDropdown from "../../../sharedComponents/CalendarDropdown";
import CustomDropdown from "../DropDown";

function capitalizeFirstLetter(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default function UsersTable() {
  const { users, loading, error } = useUsers();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

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
      const matchesRole = roleFilter === "all" ? true : user.role === roleFilter;

      const signupDate = dayjs(user.created_at);
      const matchesDate = !startDate || !endDate ? true : signupDate.isAfter(dayjs(startDate).subtract(1, 'day')) &&
          signupDate.isBefore(dayjs(endDate).add(1, 'day'));

      return matchesSearch && matchesRole && matchesDate;
    });
  }, [users, search, roleFilter, startDate, endDate]);

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full ">
        <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mb-4 animate-spin"></div>
        <div className="text-[#A1B1D6] text-base">Loading users...</div>
      </div>
    );
  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full ">
        <div className="bg-red-600 text-white p-4 rounded-lg mb-4">
          <h2 className="text-lg font-bold mb-2">Error</h2>
          <p>Error loading users: {error}</p>
        </div>
      </div>
    );

  return (
    <div className="mx-20">
      <div className="flex justify-between w-[79vw]">
        <div className="flex gap-4 items-center ml-20">
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 rounded border border-gray-400 w-92"
          />

            <CustomDropdown options={roles} selected={roleFilter} onSelect={setRoleFilter} />
        </div>
        <div className="mt-8">
          <CalendarDropdown onDateChange={handleDateChange} />
        </div>
      </div>
      <div className="overflow-auto max-h-[450px] shadow-md border-2 border-gray-600 rounded-md w-[75vw] ml-20 mt-6">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-[#091326]">
            <tr className="pl-10" >
              <th className="p-4 pl-9 w-[350px] text-white text-left text-3xl font-medium">Users </th>
              <th className="p-4  pl-18 w-[350px] text-white text-left text-3xl font-medium"> Roles </th>
              <th className="p-4 w-[150px] text-white text-left text-3xl font-medium">Sign up date </th>
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
                    <div className="flex items-center gap-2 ml-5 ">
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

                      <div className="ml-7">
                        <div className="text-teal-400 text-[22px] m ">
                          {capitalizeFirstLetter(user.first_name)} {capitalizeFirstLetter(user.last_name)}
                        </div>
                        <div className="text-[18px] text-white">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="text-white text-2xl ml-16">{user.role}</div>
                  </td>
                  <td className="p-8 text-white text-[20px] ml-5 ">
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