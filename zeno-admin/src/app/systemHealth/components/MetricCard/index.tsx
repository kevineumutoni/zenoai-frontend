import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  colorClass: string;
  icon?: React.ReactNode;
}

const MetricCard = ({ title, value, subtext, colorClass, icon }: MetricCardProps) => {
  const iconColor = colorClass.includes('purple') ? 'text-purple-700' 
    : colorClass.includes('green') ? 'text-green-700' 
    : colorClass.includes('pink') ? 'text-red-500' 
    : 'text-orange-500';
  const textColor = iconColor;

  return (
    <div className={`p-4 rounded-lg ${colorClass} shadow-sm border border-gray-200 flex flex-col relative`}>
      {icon && <div className={`absolute top-4 right-4 lg:right-2 xl:right-4 ${iconColor}`}>{icon}</div>}
      <p className="text-sm  lg:text-lg font-bold text-gray-700">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      {subtext && <p className={`text-xs mt-1 ${textColor}`}>{subtext}</p>}
    </div>
  );
};

export default MetricCard;