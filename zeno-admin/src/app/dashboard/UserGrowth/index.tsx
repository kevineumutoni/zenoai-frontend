'use client';

import { LineChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";
import { useUsers } from "../../hooks/usefetchUsers";

function getLast7DayNames(): string[] {
  const days = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    days.push(day.toLocaleDateString('en-US', { weekday: 'short' }));
  }
  return days;
}

function getLast7Dates(): string[] {
  const dates = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().slice(0, 10));
  }
  return dates;
}

export default function UserGrowthLineChart() {
  const { users, loading, error } = useUsers();
  const dayNames = getLast7DayNames();
  const last7Dates = getLast7Dates();

  const chartData = last7Dates.map((isoDate, idx) => {
    let count = 0;
    if (Array.isArray(users)) {
      count = users.filter(user => {
        const userDate = new Date(user.created_at);
        const userIso = userDate.toISOString().slice(0, 10);
        return userIso === isoDate;
      }).length;
    }
    return { day: dayNames[idx], users: count };
  });

  let cumulative = 0;
  const cumulativeData = chartData.map(entry => {
    cumulative += entry.users;
    return { day: entry.day, users: cumulative };
  });

  if (loading) {
    return (
      <section className="
        rounded-2xl bg-[#15213B] shadow-xl lg:h-12/13 w-full h-8/9 xl:py-12 xl:px-12
        p-8 flex items-center justify-center
        transition-colors duration-150 hover:bg-[#1a2947]
      ">
        <div className="text-center w-full">
          <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4 animate-spin"></div>
          <p className="text-[#A1B1D6] text-base">Loading user growth...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="
        rounded-2xl bg-[#15213B] shadow-xl lg:h-12/13 w-full h-8/9 xl:py-12 xl:px-12
        p-8 flex items-center justify-center
        transition-colors duration-150 hover:bg-[#1a2947]
      ">
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
    <section className="
      rounded-2xl bg-[#15213B] shadow-xl lg:h-12/13 w-full h-8/9 xl:py-12 xl:px-12
      p-8
      transition-colors duration-150 hover:bg-[#1a2947]
    ">
      <h2 className="2xl:text-4xl lg:text-2xl font-semibold text-white mb-3">
        User Growth (This Week)
      </h2>
      <div className="w-full flex justify-center group">
        <div className="w-full h-52 xl:h-72 lg:h-70">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cumulativeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#A1B1D6" />
              <XAxis dataKey="day" stroke="#A1B1D6" />
              <YAxis stroke="#A1B1D6" allowDecimals={false} />
              <Tooltip />
              <Legend
                wrapperStyle={{
                  color: "#A1B1D6",
                  fontWeight: 600
                }}
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#22d3ee"
                name="" 
                dot={{ stroke: "#22d3ee", strokeWidth: 2 }}
                strokeWidth={3}
                activeDot={{ r: 8, fill: "#fff", stroke: "#22d3ee", strokeWidth: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}