import React from 'react';
import Image from 'next/image';

interface CommentItemProps {
  id: number;
  name: string;
  email: string;
  comment: string;
  date: string;
  sentiment: 'Positive' | 'Negative';
  avatar: string;
}

const CommentItem: React.FC<CommentItemProps> = ({
  name,
  email,
  comment,
  date,
  sentiment,
  avatar,
}) => {
  return (
    <div className="border-b border-gray-700 pb-5 pt-10 lg:py-2 xl:py-3 lg:px-5 last:border-b-0 group">
      <div className="flex items-start space-x-3">
        <Image
          src={avatar}
          alt={name}
          width={60}
          height={60}
          className="w-15 h-15 rounded-full flex-shrink-0 ring-2 ring-transparent"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-medium text-[#9FF8F8] truncate text-sm sm:text-[18px]">{name}</h4>
            <span className="text-white sm:text-[15px] whitespace-nowrap">{date}</span>
          </div>
          <p className="text-gray-300 text-xs sm:text-[15px] truncate mb-1.5">{email}</p>
          <div className="flex items-center justify-between mb-1">
            <p className="mt-1 text-white italic text-sm sm:text-[18px] break-words leading-relaxed">
              “{comment}”
            </p>
            <span
              className={`px-10 py-2.5  lg:py-1 lg:px-5 xl:px-10 py:2.5 rounded-full font-medium ${
                sentiment === 'Positive'
                  ? 'bg-green-600 text-white'
                  : 'bg-red-600 text-white'
              }`}
            >
              {sentiment}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;