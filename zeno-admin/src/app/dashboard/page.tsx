"use client";

import UsageAnalyticsCard from "./ModuleUsage";
import UserFeedbackCard from "./UserFeedback";
import WeeklyUsageCard from "./WeeklyUsageCard";
import RecentSignupsCard from "./RecentSignupCard";
import UserGrowthLineGraph from "./UserGrowth";
export default function DashboardPage() {
    return (
      <div className="min-h-screen lg:px-15 2x:pl-35 2x:pr-30 2xl:py-13 2x:pb-20 lg:py-10">
        <h1 className="text-3xl md:text-4xl sm:text-[50px xl:text-[50px] font-semibold text-[#9FF8F8] mb-2">Dashboard</h1>
        <div className="lg:gap-10 2x:gap-8 grid grid-cols-1 md:grid-cols-3">
          <UsageAnalyticsCard />
          <UserFeedbackCard />
          <UserGrowthLineGraph/>
        </div>
        <div className="grid grid-cols-1 2xl:mt-10 lg:mt-4 md:grid-cols-2 xl:gap-10  lg:gap-10 2xl:gap-20">
          <WeeklyUsageCard />
          <RecentSignupsCard />
        </div>
      </div>
    );
  }



