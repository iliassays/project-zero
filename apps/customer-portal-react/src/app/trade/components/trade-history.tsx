import { TradeHistory } from '../domain/trade-history';

interface TradeHistoryCardProps {
  tradeHistory: TradeHistory;
}

export default function TradeHistoryCard({ tradeHistory }: TradeHistoryCardProps) {
  return (
    <li className="flex justify-between gap-x-6 py-5">
      <div className="flex gap-x-4">
        <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={tradeHistory.ticker + ".png"} alt="" />
        <div className="min-w-0 flex-auto">
          <p className="text-sm font-semibold leading-6 text-gray-900">{tradeHistory.ticker}</p>
          <p className="mt-1 truncate text-xs leading-5 text-gray-500">{tradeHistory.tradeType} - {tradeHistory.interval} - {tradeHistory.created_at}</p>
        </div>
      </div>
      <div key={tradeHistory._id} className="hidden sm:flex sm:flex-col sm:items-end">
          <p className="text-sm leading-6 text-gray-900 text-left">
            {tradeHistory.status === "Running" ? "Running" : `${tradeHistory.profitOrLoss} %`}
        </p>
      </div>
    </li>

  );
}