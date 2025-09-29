'use client';

import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";
import { useUsers } from "../../hooks/useFetchUsers";

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
      <section className="xl:h-12/13 rounded-2xl bg-[#15213B] shadow-xl xl:p-4 w-full flex items-center justify-center
        lg:max-w-[220px] lg:shadow-sm lg:rounded-lg lg:h-[120px] lg:p-2"
        style={{ maxWidth: 500, minHeight: 200 }}>
        <div className="text-center w-full">
          <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4 animate-spin"></div>
          <p className="text-[#A1B1D6] text-base lg:text-xs">Loading user growth...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="xl:h-12/13 rounded-2xl bg-[#15213B] shadow-xl xl:p-8 w-full flex items-center justify-center
        lg:max-w-[220px] lg:p-2 lg:shadow-sm lg:rounded-lg lg:h-[120px]"
        style={{ maxWidth: 500, minHeight: 200 }}>
        <div className="text-center w-full">
          <div className="bg-red-600 text-white p-4 rounded-lg mb-4 lg:p-2 lg:mb-2">
            <h2 className="text-lg font-bold mb-2 lg:text-base lg:mb-1">Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="2xl:h-13/13 xl:h-13/13 rounded-2xl bg-[#15213B] shadow-xl xl:p-4 w-full
      lg:max-w-[220px] lg:p-2 lg:shadow-sm lg:rounded-lg lg:h-[180px]"
      style={{ maxWidth: 500 }}>
      <h2 className="2xl:text-4xl xl:text-2xl font-semibold text-white 2xl:mb-2 xl:mb-2 lg:text-base lg:mb-1">
        User Growth (This Week)
      </h2>
      <div className="w-full mt-6">
        <div className="w-full h-[220px] xl:h-[220px] lg:h-[110px] 2xl:h-[220px]">
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