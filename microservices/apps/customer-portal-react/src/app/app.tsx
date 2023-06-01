import { Route, Routes } from 'react-router-dom';
import { Signals } from './signals/signals';
import { Header, PageHeader } from '@customer-portal-react/shared/ui';

function App() {
  return (
    <div className="min-h-full">
        <Header></Header>
        {/* <PageHeader title='Signals'></PageHeader> Should be only placeholder */}
        <PageHeader title='Signals'></PageHeader>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Signals />}></Route>
            </Routes>
          </div>
        </main>
      </div>
  );
}
export default App;