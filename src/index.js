import './bootstrap';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Profiler } from 'components/profiler';
import * as auth from 'auth-provider';
import { client } from 'utils/api-client';
import store from 'app/store';
import { prefetch } from 'reducers/userSlice';
import { App } from './app';
import { loadDevTools } from './dev-tools/load';
import { AppProviders } from './context';

async function bootstrapAppData() {
  let user = null;

  const token = await auth.getToken();
  if (token) {
    const data = await client('bootstrap', { token });
    // queryClient.setQueryData('list-items', data.listItems, {
    //   staleTime: 5000,
    // });
    // for (const listItem of data.listItems) {
    //   setQueryDataForBook(queryClient, listItem.book);
    // }
    user = data.user;
  }
  store.dispatch(prefetch(user));
  return user;
}

loadDevTools(() => {
  ReactDOM.render(
    <Profiler id="App Root" phases={['mount']}>
      <AppProviders>
        <App />
      </AppProviders>
    </Profiler>,
    document.getElementById('root'),
    () => {
      bootstrapAppData();
    },
  );
});
