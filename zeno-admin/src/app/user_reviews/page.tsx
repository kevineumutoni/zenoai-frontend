'use client';

import React, { useState } from 'react';
import useFetchUserReview from '../hooks/useFetchUserReviews';
import StatsCard from './components/StatsCard';
import Comments from './components/Comments';
import { Users, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp } from 'lucide-react';

const UserFeedbackPage = () => {
  const { data, loading, error } = useFetchUserReview();
  const [filter, setFilter] = useState<'All' | 'Positive' | 'Negative'>('All');
  const [isOpen, setIsOpen] = useState(false);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-xl">Users feedback is loading..</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-400 p-6">
        <div className="text-xl mb-2"> Failed to load feedback</div>
        <div className="text-sm text-gray-400">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-teal-600 rounded text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  const filteredComments = data.comments.filter(comment => {
    if (filter === 'All') return true;
    return comment.sentiment === filter;
  });

  const toggleDropdown = () => setIsOpen(!isOpen);
  const selectOption = (value: string) => {
    setFilter(value as any);
    setIsOpen(false);
  };

  const options = [
    { value: 'All', label: 'All User Feedback' },
    { value: 'Positive', label: 'Positive Only' },
    { value: 'Negative', label: 'Negative Only' },
  ];

  const currentLabel = options.find(opt => opt.value === filter)?.label || 'All User Feedback';

  return (
    <div className=" text-white md:w-7/8 md:mx-auto">
      <div className="  sm:pt-25 lg:pt-15 xl:pt-25">
        <div className="mb-8 mt-[-10px] ">
          <h2 className="text-3xl md:text-4xl sm:text-[50px xl:text-[50px] 2xl:font-semibold text-[#9FF8F8] mb-2">User Feedback Analysis</h2>
          <p className="sm:text-[24px] lg:text-[20px] xl:text-[34px]">Aggregated user feedback and sentiment analysis on comments</p>
        </div>

        <div className="grid grid-cols-1  lg:grid-cols-3 gap-25">
          <div className="lg:col-span-1 space-y-6 lg:mt-13 ">
            <StatsCard
              title="Total Feedback"
              value={data.totalReview}
              type="total"
              icon={<Users className="w-11 h-11" />}
            />
            <StatsCard
              title="Likes"
              value={data.likes}
              type="like"
              icon={<ThumbsUp className="w-11 h-11" />}
            />
            <StatsCard
              title="Dislikes"
              value={data.dislikes}
              type="dislike"
              icon={<ThumbsDown className="w-11 h-11" />}
            />
          </div>

          <div className="lg:col-span-2 ">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[24px]">User Comments</h3>


              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center justify-between w-full lg:py-1 lg:pr-2 gap-16  pr-3 pl-7 py-2.5 bg-transparent border border-[#9FF8F8] rounded-full text-white focus:outline-none focus:ring-white transition-colors duration-200"
                >
                  {currentLabel}
                  <div className="text-white opacity-70 ">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isOpen && (
                  <ul className="absolute right-0 mt-3 w-full bg-gray-800 border border-gray-700 shadow-lg z-10">
                    {options.map(option => (
                      <li
                        key={option.value}
                        onClick={() => selectOption(option.value)}
                        className="px-5 py-3 text-white hover:bg-white hover:text-gray-800 cursor-pointer"
                      >
                        {option.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <Comments comments={filteredComments} />
            
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFeedbackPage;