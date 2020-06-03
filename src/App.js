import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import GlobalState from './state/global-state';
import UsageInputPage from './pages/input-page';
import OutputPage from './pages/output-page';
import BillinLineModal from './components/billing-line-modal';
import './App.css';

function App() {
  return (
    <GlobalState>
       <BillinLineModal />
       <ToastContainer />
      <BrowserRouter>
        <Switch>
          <Route path="/" render={(props) => <UsageInputPage {...props} />} exact />
          <Route path="/output" component={ OutputPage } exact />
        </Switch>
      </BrowserRouter>     
    </GlobalState>
  );
}

export default App;
