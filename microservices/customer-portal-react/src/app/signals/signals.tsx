import { Banner } from '@customer-portal-react/shared/ui'
import styles from './signals.module.css';

import SignalCard from './components/signal-card'
import { Signal } from './domain/signal';
import { ChangeEvent, useEffect, useState } from 'react';
import *  as  Realm from "realm-web";
import { isGeneratorFunction } from 'util/types';

/* eslint-disable-next-line */
export interface SignalsProps { }

export function Signals() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [user, setUser] = useState<unknown>();
  const app = new Realm.App({ id: "data-lsbmb" });
  // useEffect(() => {
  //   async function loadSignalSummary() {
  //     const res = await fetch('https://eu-central-1.aws.data.mongodb-api.com/app/data-lsbmb/endpoint/get_signal_summary');
  //     const result = await res.json();

  //     if (result.error) {
  //       setSignals([]);
  //     } else {
  //       setSignals(result);
  //     }
  //   }

  //   loadSignalSummary();

  //   setInterval(async () => {
  //     loadSignalSummary();
  //   }, 10000);

  // }, []);


  // This useEffect hook will run only once when the page is loaded

  useEffect(() => {
    const login = async () => {
      // Authenticate anonymously
      const user = await app.logIn(Realm.Credentials.anonymous());
      setUser(user);

      // Connect to the database
      const mongodb = app.currentUser?.mongoClient("mongodb-atlas");
      const collection = mongodb?.db("ProjectZero").collection("TradeAlertSummary");

      // Everytime a change happens in the stream, add it to the list of events
      if (collection) {
        for await (const change of collection.watch()) {
          setSignals(signals  => [...signals, change.valueOf() as Signal]);
        }
      }
    }
    login();
  }, []);

  return (
    <ul role="list" className="divide-y divide-gray-100">
      {signals?.map((signal) => <SignalCard key={signal._id} signal={signal} />)}
    </ul>
  )
}

export default Signals;
