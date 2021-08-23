import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store';
import { QueryClientProvider } from './query-client';

function AppProviders({ children }) {
  return (
    <Provider store={store}>
      <QueryClientProvider>
        <Router>
          {children}
        </Router>
      </QueryClientProvider>
    </Provider>
  );
}

export { AppProviders };
