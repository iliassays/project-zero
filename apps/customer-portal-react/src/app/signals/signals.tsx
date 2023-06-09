import { Banner, PageHeader } from '@customer-portal-react/shared/ui'
import styles from './signals.module.css';

import SignalCard from './components/signal-card'
import { Signal } from './domain/signal';
import { useEffect, useState } from 'react';
import *  as  Realm from "realm-web";

/* eslint-disable-next-line */
export interface SignalsProps { }

export function Signals() {
  const [signals, setSignals] = useState<Signal[]>();
  const [user, setUser] = useState<unknown>();

  const app = new Realm.App({ id: "data-lsbmb" });

  const loadSignalSummary = async () => {
    const res = await fetch('https://eu-central-1.aws.data.mongodb-api.com/app/data-lsbmb/endpoint/get_signal_summary');
    const result = await res.json();

    if (result.error) {
      setSignals([]);
      //Write code for display error messages
    } else {
      setSignals(result);
    }
  }

  const setupSSEConnection = async () => {

    if (!signals)
      return;
    // Authenticate anonymously
    const user = await app.logIn(Realm.Credentials.anonymous());
    setUser(user);

    // Connect to the database
    const mongodb = app.currentUser?.mongoClient("Cluster0");
    const collection = mongodb?.db("ProjectZero").collection("TradeAlertSummary");

    // Everytime a change happens in the stream, add it to the list of events
    if (collection) {
      for await (const change of collection.watch(
        { fullDocument: "updateLookup" })) {
        if (change.operationType === 'update' || change.operationType === 'insert') {
          let signal = signals?.find(s => s._id === change.fullDocument._id.toString());

          if (!signal) {
            setSignals(signalss => [...signals, change.fullDocument as Signal]);
          }
          else {
            const updatedSignal = change.fullDocument as Signal; //better to fetch only changed properties.
            signal = updatedSignal;

            setSignals(prevArray => {
              return prevArray?.map(obj => {
                if (obj._id === updatedSignal?._id.toString()) {
                  return { ...obj, ...signal };
                }

                return obj;
              });
            });
          }
        }
      }
    }
  }

  useEffect(() => {
    loadSignalSummary();
  }, []);


  useEffect(() => {
    setupSSEConnection();
  }, []);

  return (
    <>
      <PageHeader title="Signals"></PageHeader>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <ul className="divide-y divide-gray-100">
            {signals?.map((signal) => <SignalCard key={signal._id} signal={signal} />)}
          </ul>
        </div>
      </main>
    </>

  )
}

export default Signals;
