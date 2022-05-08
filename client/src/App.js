import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Home';
import PayInvoice from './PayInvoice';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/pay_invoice/:invoice_number' element={<PayInvoice />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
