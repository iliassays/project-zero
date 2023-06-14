import { Banner, PageHeader } from '@customer-portal-react/shared/ui'
import styles from './signals.module.css';


import { useEffect, useState } from 'react';
import *  as  Realm from "realm-web";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localeEn from "dayjs/locale/en";
import { TradeHistory } from './domain/trade-history';
import TradeHistoryCard from './components/trade-history';
import TradeFilter from './components/trade-filter';
import TradeAnalytics from './components/trade-analytics';
import React from 'react';
import { TradeSummary } from './domain/trade-summary';

/* eslint-disable-next-line */
export interface SignalsProps { }

const Trades = () => {
  const [selectedTicker, setTicker] = React.useState({ name: 'TSLA' });
  const [selectedTradeType, setTradeType] = React.useState( { name: 'ALL' });
  const [selectedInterval, setInterval] = React.useState( { name: 'ALL' });
  
  const [trades, setTrades] = useState<TradeHistory[]>();
  const [tradeSummary, setTradeSummary] = useState<TradeSummary>();
  const [, setUser] = useState<unknown>();

  const app = new Realm.App({ id: "data-lsbmb" });

  const timeAgo = (postDate) => {
    dayjs.extend(relativeTime).locale(localeEn);
    const fromNowOn = dayjs(postDate).fromNow();

    return (fromNowOn);
  };

  const calculateProfitPercentage = (tradeType: string, open: number, close: number) => {
    const profitPercentage = tradeType === 'Long' ?
      ((close - open) / open) * 100 :
      (((open - close) / close) * 100)

    return profitPercentage;
  };

  const loadTradeHistory = async (ticker: string, tradeType: string, interval: string) => {
    const res = await fetch(
      `https://eu-central-1.aws.data.mongodb-api.com/app/data-lsbmb/endpoint/get_trade_history?${new URLSearchParams({ticker: ticker, tradeType: tradeType, interval: interval})}`
      );
    let result = await res.json();

    if (result.error) {
      setTrades([]);
      //Write code for display error messages
    } else {
      result = (result as TradeHistory[]).map(tradeHistory => {
        return {
          ...tradeHistory,
          timeAgo: timeAgo(tradeHistory.updated_at),
          //profit: calculateProfitPercentage(tradeHistory.tradeType, tradeHistory.open, tradeHistory.close)
        }
      });

      setTrades(result);
    }
  }

  const loadTradeSummary = async (ticker: string, tradeType: string, interval: string) => {
    const res = await fetch(
      `https://eu-central-1.aws.data.mongodb-api.com/app/data-lsbmb/endpoint/get_trade_summary?${new URLSearchParams({ticker: ticker, tradeType: tradeType, interval: interval})}`
      );

    let result = await res.json();

    if (result.error) {
      setTradeSummary([]);
      //Write code for display error messages
    } else {
      setTradeSummary(result[0]);
    }
  }

  const setupSSEConnection = async () => {

    if (!trades)
      return;
    // Authenticate anonymously
    const user = await app.logIn(Realm.Credentials.anonymous());
    setUser(user);

    // Connect to the database
    const mongodb = app.currentUser?.mongoClient("Cluster0");
    const collection = mongodb?.db("ProjectZero").collection("order_history");

    // Everytime a change happens in the stream, add it to the list of events
    if (collection) {
      for await (const change of collection.watch(
        { fullDocument: "updateLookup" })) {
        if (change.operationType === 'update' || change.operationType === 'insert') {
          const tradeHistory = change.fullDocument as TradeHistory;

          setTrades((trades) => [
            ...trades ?? [],
            {
              ...tradeHistory,
              timeAgo: timeAgo(tradeHistory.updated_at),
              //profit: calculateProfitPercentage(tradeHistory.tradeType, tradeHistory.open, tradeHistory.close)
            }
          ]);
        }
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try{
        const [dataResponse, summaryResponse] = await Promise.all(
          [
            loadTradeHistory(selectedTicker.name, selectedTradeType.name, selectedInterval.name),
            loadTradeSummary(selectedTicker.name, selectedTradeType.name, selectedInterval.name)
          ]
        )
      }
      catch(error){
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [selectedTicker, selectedTradeType, selectedInterval]);


  useEffect(() => {
    //setupSSEConnection();
  }, [trades]);

  return (
    <>
      <PageHeader title="Trades"
        filterComponent={
        <TradeFilter
        selectedTicker={selectedTicker}
        setTicker={setTicker}
        selectedTradeType={selectedTradeType}
        setTradeType={setTradeType}
        selectedInterval={selectedInterval}
        setInterval={setInterval}
         />
      }
      analyticsComponent={<TradeAnalytics tradeSummary={tradeSummary} />}></PageHeader>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <ul className="divide-y divide-gray-100">
            {trades?.map((trade) => <TradeHistoryCard key={trade._id} tradeHistory={trade} />)}
          </ul>
        </div>
      </main>
    </>
  )
}

export default Trades;
