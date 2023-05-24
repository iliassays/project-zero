import { Signal } from '../domain/signal';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localeEn from "dayjs/locale/en";

const sizeclassNamees = {
  height: "h-32",
  width: "w-32",
};

interface SignalCardProps {
  signal: Signal;
}

const intervals = [
  { id: 1, name: '1', value: '1 Min' },
  { id: 2, name: '5', value: '5 Min' },
  { id: 3, name: '15', value: '15 Min' },
  { id: 4, name: '30', value: '30 Min' },
  { id: 5, name: '60', value: '1 Hour' },
  { id: 6, name: '240', value: '4 Hour' },
  { id: 7, name: '1440', value: '1 Day' },
];

const daysago = (postDate) => {
  dayjs.extend(relativeTime).locale(localeEn)
  var fromNowOn = dayjs(postDate).fromNow();
  return (fromNowOn)
};

export default function SignalCard({ signal }: SignalCardProps) {
  return (
    <li className="flex justify-between gap-x-6 py-5">
      <div className="flex gap-x-4">
        <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src="/bitcoin.png" alt="" />
        <div className="min-w-0 flex-auto">
          <p className="text-sm font-semibold leading-6 text-gray-900">{signal.ticker}</p>
          <p className="mt-1 truncate text-xs leading-5 text-gray-500">{signal.algo}</p>
        </div>
      </div>
      {intervals.map((interval) => (
        <div key={interval.id} className="hidden sm:flex sm:flex-col sm:items-end">
          <p className="text-sm leading-6 text-gray-900">
            {interval.value}
            {signal.alertByInterval[interval.name] ?
              signal.alertByInterval[interval.name]?.tradeType === 'buy' ? <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                Buy
              </span> : <span className="inline-flex items-center rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-700/10">
                Sell
              </span> : null
            }
          </p>
          <p className="mt-1 text-xs leading-5 text-gray-500">
            {signal.alertByInterval[interval.name] ?
              <time>{daysago(signal.alertByInterval[interval.name]?.timestamp)}</time> :
              "(Not Defined)"
            } </p>
        </div>
      ))}
    </li>

  );
}