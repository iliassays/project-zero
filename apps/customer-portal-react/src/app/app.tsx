import { Route, Routes } from 'react-router-dom';
import { Signals } from './signals/signals';
import Trades from './trade/trade';
import { Header } from '@customer-portal-react/shared/ui';

function App() {
  
  return (
    <div className="min-h-full">
    <Header></Header>
    <Routes>
      <Route path="/" element={<Signals />}></Route>
      <Route path="/trade-history" element={<Trades />}></Route>
    </Routes>
  </div>
    
  );
}
export default App;