export interface TradeHistory {
  _id: string, // return id instead of _id from backend
  ticker: string,
  algo: string,
  interval: string,
  close: number,
  open: number,
  profitOrLoss: number,
  status: string,
  tradeType: string,
  created_at?: string,
  updated_at?: string
}