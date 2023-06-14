export interface Signal {
  _id: string, // return id instead of _id from backend
  ticker: string,
  algo: string,
  alertByInterval: Record<string, Alert>,
  created_at?: string,
  updated_at?: string
}


export interface Alert{
  tradeType: string,
  price: number,
  timestamp: string,
  timeAgo?: string
}