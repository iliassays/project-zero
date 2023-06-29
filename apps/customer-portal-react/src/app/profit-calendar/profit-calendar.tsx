import { PageHeader } from '@customer-portal-react/shared/ui'
import { useEffect, useState } from 'react';
import *  as  Realm from "realm-web";
import { ProfitLoss } from './domain/profit-loss';
import React from 'react';
import ProfitCalanderFilter from './components/profit-calender-filter';
import ProfitCalenderAnalytics from './components/profit-calendar-analytics';
import { ProfitLossSummary } from './domain/profit-loss-summary';
import ProfitCalendarCard from './components/profit-calendar';

const ProfitCalendar = () => {
  const [selectedTicker, setTicker] = React.useState({ name: 'TSLA' });
  const [selectedTradeType, setTradeType] = React.useState( { name: 'ALL' });
  const [selectedInterval, setInterval] = React.useState( { name: 'ALL' });
  
  const [profitLoss, setProfitLoss] = useState<ProfitLoss[]>();
  const [profitLossSummary, setProfitLossSummary] = useState<ProfitLossSummary>();

  const [, setUser] = useState<unknown>();

  const loadProfitLoss = async (ticker: string, tradeType: string, interval: string) => {
    const res = await fetch(
      `https://eu-central-1.aws.data.mongodb-api.com/app/data-lsbmb/endpoint/get_trade_profit_loss_summary?${new URLSearchParams({ticker: ticker, tradeType: tradeType, interval: interval})}`
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
      try{
        const [dataResponse] = await Promise.all(
          [
            loadProfitLoss(selectedTicker.name, selectedTradeType.name, selectedInterval.name),
          ]
        )
      }
      catch(error){
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [selectedTicker, selectedTradeType, selectedInterval]);

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
          <ul className="divide-y divide-gray-100">
            {profitLoss?.map((pl) => <ProfitCalendarCard key={pl.date} profitCalendar={pl} />)}
          </ul>
        </div>
      </main>
    </>
  )
}

export default ProfitCalendar;
