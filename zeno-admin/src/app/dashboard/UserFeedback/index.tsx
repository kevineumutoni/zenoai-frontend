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
      <section className="lg:h-12/13 rounded-2xl bg-[#15213B] shadow-xl w-full h-9/10 px-8 py-8 lg:px-8 lg:py-8 2xl:px-12 2xl:py-12 flex items-center justify-center" style={{ maxWidth: 500, minHeight: 200 }}>
        <div className="text-center w-full">
          <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4 animate-spin"></div>
          <p className="text-[#A1B1D6] text-base">Loading user feedback...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="lg:h-12/13 rounded-2xl bg-[#15213B] shadow-xl w-full h-9/10 px-8 py-8 lg:px-8 lg:py-8 2xl:px-12 2xl:py-12 flex items-center justify-center" style={{ maxWidth: 500, minHeight: 200 }}>
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
    <section className="lg:h-12/13 rounded-2xl bg-[#15213B] shadow-xl w-full h-9/10 px-8 py-8 lg:px-8 lg:py-8 2xl:px-12 2xl:py-12" style={{ maxWidth: 500 }}>
      <h2 className="2xl:text-4xl lg:text-2xl font-semibold text-white mb-2">
        User Feedback
      </h2>
      <p className="2xl:text-lg lg:text-base mb-7 text-white">
        Latest comments from users
      </p>
      <ul className="2xl:space-y-6 lg:space-y-3">
        {Array.isArray(data?.comments) && data.comments
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3)
          .map((review) => {
            const sentiment = review.sentiment;
            return (
              <li key={review.id} className="flex items-center justify-between text-white lg:text-lg 2xl:text-xl">
                <div>
                  <div className="mb-1">
                    “{review.comment.length > 35 ? review.comment.slice(0, 35) + "....." : review.comment}”
                  </div>
                  <div className="text-base text-[#A1B1D6]">
                    {review.name ? `From ${review.name}` : `From User #${review.id}`}
                  </div>
                </div>
                <span className={`rounded-full px-1 lg:text-sm 2xl:text-md lg:py-1 2xl:px-8 ${sentimentConfig[sentiment].bg} ${sentimentConfig[sentiment].text}`}>
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