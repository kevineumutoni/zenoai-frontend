import React from 'react';

interface StatsCardProps {
  title: string;
  value: number;
  change?: string;
  type: 'total' | 'like' | 'dislike';
  icon?: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, type, icon }) => {
  const getStyles = () => {
    switch (type) {
      case 'total':
        return {
          bg: 'bg-white',
          border: 'border border-white',
          textColor: 'text-[#0B182F]',
          iconColor: 'text-gray-600',
          borderRadius: 'rounded-xl',
          titleColor: 'text-gray-700',
        };
      case 'like':
      case 'dislike':
        return {
          bg: 'bg-transparent',
          border: 'border border-white',
          iconColor: type === 'like' ? 'text-green-400' : 'text-red-400',
          borderRadius: 'rounded-lg',
          textColor: 'text-white',
          titleColor: 'text-white',
        };
      default:
        return {
          bg: 'bg-gray-800',
          border: 'border border-white',
          textColor: 'text-white',
          iconColor: 'text-gray-400',
          borderRadius: 'rounded-lg',
        };
    }
  };

  const { bg, border, textColor, iconColor, titleColor } = getStyles();
  return (
    <div className={`pt-5 pb-6 pl-10 pr-7 ${bg} ${border} rounded-3xl transition-all duration-300 hover:shadow-lg md:pt-4 lg:py-2 xl:pt-8 2xl:px-10 2xl:pb-8 md:pb-5 md:pl-6 md:pr-2 `}>
      <div className="flex justify-between items-start">
        <div>
          <p className={`text-[25px] xl:text-[25px] font-medium ${titleColor} md:text-[20px]`}>{title}</p>
          <p className={`text-[40px] xl:text-[40px] font-bold ${textColor} md:text-[32px]`}>{value}</p>
        </div>
        {icon && <div className={`${iconColor} mt-2`}>{icon}</div>}
      </div>
    </div>
  );
};

export default StatsCard;