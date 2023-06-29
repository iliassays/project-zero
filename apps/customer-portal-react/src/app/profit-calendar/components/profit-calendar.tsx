import { ProfitCalendar } from '../domain/profit-loss';

interface TradeHistoryCardProps {
  profitCalendar: ProfitCalendar;
}

export default function ProfitCalendarCard({ profitCalendar }: TradeHistoryCardProps) {
  return (
    <li className="flex justify-between gap-x-6 py-5">
      <div className="flex gap-x-4">
       <div className="min-w-0 flex-auto">
          <p className="text-sm font-semibold leading-6 text-gray-900">{profitCalendar.date}</p>
       </div>
      </div>
      <div className="hidden sm:flex sm:flex-col sm:items-end">
          <p className="text-sm leading-6 text-gray-900 text-left">
            {profitCalendar.totalProfitOrLoss} %
          </p>
        </div>
    </li>

  );
}