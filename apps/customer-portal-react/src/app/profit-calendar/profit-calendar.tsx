import { PageHeader } from '@customer-portal-react/shared/ui'
import { useEffect, useState } from 'react';
import *  as  Realm from "realm-web";
import { ProfitLoss } from './domain/profit-loss';
import React from 'react';
import ProfitCalanderFilter from './components/profit-calender-filter';
import ProfitCalenderAnalytics from './components/profit-calendar-analytics';
import { ProfitLossSummary } from './domain/profit-loss-summary';
import { addDays, addHours, addMonths, format, startOfMonth, subDays, subHours, parse, parseISO } from 'date-fns';
import { DefaultMonthlyEventItem, MonthlyBody, MonthlyCalendar, MonthlyDay, MonthlyNav } from './components/calendar';
import { title } from 'process';


const ProfitCalendar = () => {
  const [selectedTicker, setTicker] = React.useState({ name: 'TSLA' });
  const [selectedTradeType, setTradeType] = React.useState({ name: 'ALL' });
  const [selectedInterval, setInterval] = React.useState({ name: 'ALL' });

  const [profitLoss, setProfitLoss] = useState<ProfitLoss[]>([]);
  const [profitLossSummary, setProfitLossSummary] = useState<ProfitLossSummary>();

  const [, setUser] = useState<unknown>();

  const [currentMonth, setCurrentMonth] = useState<Date>(
    startOfMonth(new Date())
  );

  const loadProfitLoss = async (ticker: string, tradeType: string, interval: string) => {
    const res = await fetch(
      `https://eu-central-1.aws.data.mongodb-api.com/app/data-lsbmb/endpoint/get_trade_profit_loss_summary?${new URLSearchParams({ ticker: ticker, tradeType: tradeType, interval: interval })}`
    );
    let result = await res.json();

    if (result.error) {
      setProfitLoss([]);
      //Write code for display error messages
    } else {
      result = (result as ProfitLoss[]).map(pc => {
        return {
          ...pc
          //profit: calculateProfitPercentage(tradeHistory.tradeType, tradeHistory.open, tradeHistory.close)
        }
      });

      setProfitLoss(result);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dataResponse] = await Promise.all(
          [
            loadProfitLoss(selectedTicker.name, selectedTradeType.name, selectedInterval.name),
          ]
        )
      }
      catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [selectedTicker, selectedTradeType, selectedInterval, currentMonth]);

  return (
    <>
      <PageHeader title="Profit Calendar"
        filterComponent={
          <ProfitCalanderFilter
            selectedTicker={selectedTicker}
            setTicker={setTicker}
            selectedTradeType={selectedTradeType}
            setTradeType={setTradeType}
            selectedInterval={selectedInterval}
            setInterval={setInterval}
          />
        }
        analyticsComponent={<ProfitCalenderAnalytics profitLossSummary={profitLossSummary} />}></PageHeader>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <MonthlyCalendar
            currentMonth={currentMonth}
            onCurrentMonthChange={date => setCurrentMonth(date)}
          >
            <MonthlyNav />
            <MonthlyBody
              omitDays={[0, 6]}
              events={
                profitLoss?.map((item) => { 
                  return {title: item.totalProfitOrLoss.toFixed(2), date: new Date(item.date)}
                })
              }
            >
              <MonthlyDay<EventType>
                renderDay={data =>
                  data.map((item, index) => (
                    <DefaultMonthlyEventItem
                      key={index}
                      title={item.title}
                      date={format(item.date, 'k:mm')}
                      cssClasses={Number(item.title) > 0 ? 'text-green-600': 'text-red-600'}
                    />
                  ))
                }
              />
            </MonthlyBody>
          </MonthlyCalendar>
        </div>
      </main>
    </>
  )
}

export default ProfitCalendar;

export type EventType = {
  title: string;
  date: Date;
};
export const events: { [key: string]: EventType[] } = {
  firstMonth: [
    { title: 'Call John', date: subHours(new Date(), 2) },
    { title: 'Call John', date: subHours(new Date(), 1) },
    { title: 'Meeting with Bob', date: new Date() },
    { title: 'Bike Appt', date: addHours(new Date(), 3) },
    { title: 'John Hilmer', date: addDays(new Date(), 3) },
    { title: 'Jane Call', date: subDays(new Date(), 4) },
    { title: 'Sound alarm', date: addDays(new Date(), 6) },
    { title: 'Soccer Practice', date: subDays(new Date(), 3) },
    { title: 'Alert', date: addHours(subDays(new Date(), 4), 4) },
    { title: 'Donation', date: addDays(new Date(), 6) },
  ],
  secondMonth: [
    { title: 'Meeting Next Month', date: addMonths(new Date(), 1) },
  ],
};