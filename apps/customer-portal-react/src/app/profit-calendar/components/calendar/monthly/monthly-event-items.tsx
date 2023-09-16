import React from 'react';

type DefaultEventItemProps = {
  title: string;
  date: string;
  cssClasses: string;
};

export const DefaultMonthlyEventItem = ({
  title,
  date,
  cssClasses
}: DefaultEventItemProps) => {
  return (
    <li className="py-10">
    <div className="text-center">
    <p className={`text-3xl font-bold text-base font-semibold ${cssClasses}`}>{title}%</p>
    </div>
  </li>
  );
};