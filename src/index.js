import './bootstrap';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Profiler } from 'components/profiler';
import * as auth from 'auth-provider';
import { client } from 'utils/api-client';
import store from 'app/store';
import { prefetchUser } from 'reducers/userSlice';
import { prefetchListItem } from 'reducers/listItemSlice';
import { App } from './app';
import { loadDevTools } from './dev-tools/load';
import { AppProviders } from './context';

async function getPrefetchUser() {
  const userState = {
    status: 'pending', user: null, error: null,
  };
  const listItemState = {
    status: 'pending',
    listItems: [],
  };
  try {
    const token = await auth.getToken();
    if (token) {
      const { user, listItems } = await client('bootstrap', { token });
      userState.user = user;
      listItemState.listItems = listItems;
    }
    userState.status = 'resolved';
    listItemState.status = 'resolved';
    store.dispatch(prefetchUser(userState));
    store.dispatch(prefetchListItem(listItemState));
  } catch (error) {
    userState.status = 'rejectedApp';
    userState.error = error;
    store.dispatch(prefetchUser(userState));
  }
}

loadDevTools(() => {
  ReactDOM.render(
    <Profiler id="App Root" phases={['mount']}>
      <AppProviders>
        <App />
      </AppProviders>
    </Profiler>,
    document.getElementById('root'),
    getPrefetchUser
    ,
  );
});
