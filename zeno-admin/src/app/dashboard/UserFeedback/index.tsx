'use client';

import React from "react";
import useFetchUserReviews from "../../hooks/useFetchUserReviews";

const sentimentConfig = {
  Positive: {
    label: "Positive",
    bg: "bg-green-500",
    text: "text-white"
  },
  Negative: {
    label: "Negative",
    bg: "bg-[#e11d48]",
    text: "text-white"
  }
};

const RecentFeedbackCard: React.FC = () => {
  const { data, loading, error } = useFetchUserReviews();

  if (loading) {
    return (
      <section className="xl:h-12/13 rounded-2xl bg-[#15213B] shadow-xl w-full xl:h-9/10 px-8 py-8 xl:px-8 xl:py-8 2xl:px-12 2xl:py-12 flex items-center justify-center
        lg:max-w-[220px] lg:p-2 lg:h-[180px]"
        style={{ maxWidth: 500, minHeight: 200 }}>
        <div className="text-center w-full">
          <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4 animate-spin"></div>
          <p className="text-[#A1B1D6] text-base lg:text-xs">Loading user feedback...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="xl:h-12/13 rounded-2xl bg-[#15213B] shadow-xl w-full xl:h-9/10 px-8 py-8 xl:px-8 xl:py-8 2xl:px-12 2xl:py-12 flex items-center justify-center
        lg:max-w-[220px] lg:p-2 lg:h-[180px]"
        style={{ maxWidth: 500, minHeight: 200 }}>
        <div className="text-center w-full">
          <div className="bg-red-600 text-white p-4 lg:p-2 rounded-lg mb-4 lg:mb-2">
            <h2 className="text-lg font-bold mb-2 lg:text-base lg:mb-1">Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="2xl:h-13/13 xl:h-13/13 rounded-2xl bg-[#15213B] shadow-xl w-full px-8 pt-5 pb-10 xl:p-4
      lg:max-w-[220px] lg:p-2 lg:rounded-lg lg:h-[180px]"
      style={{ maxWidth: 500 }}>
      <h2 className="2xl:text-4xl xl:text-2xl font-semibold text-white 2xl:mb-2 xl:mb-2 lg:text-base lg:mb-1">
        User Feedback
      </h2>
      <p className="2xl:text-lg xl:text-base 2xl:mb-7 xl:mb-4 text-white lg:text-xs lg:mb-1">
        Latest comments from users
      </p>
      <ul className="2xl:space-y-3 xl:space-y-1 lg:space-y-1">
        {Array.isArray(data?.comments) && data.comments
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3)
          .map((review) => {
            const sentiment = review.sentiment;
            return (
              <li key={review.id} className="flex items-center justify-between text-white xl:text-lg 2xl:text-xl lg:text-xs">
                <div>
                  <div className="mb-1 lg:mb-0 break-words">
                    “{review.comment.length > 35 ? review.comment.slice(0, 35) + "....." : review.comment}”
                  </div>
                  <div className="text-base text-[#A1B1D6] lg:text-xs">
                    {review.name ? `From ${review.name}` : `From User #${review.id}`}
                  </div>
                </div>
                <span className={`rounded-full px-4 2xl:py-2 lg:py-0 min-w-[75px] text-base  xl:text-base lg:text-sm xl:px-4 2xl:text-md 2xl:px-8 ${sentimentConfig[sentiment].bg} ${sentimentConfig[sentiment].text} lg:text-xs lg:px-2 lg:py-1`}>
                  {sentimentConfig[sentiment].label}
                </span>
              </li>
            );
          })}
      </ul>
    </section>
  );
};

export default RecentFeedbackCard;