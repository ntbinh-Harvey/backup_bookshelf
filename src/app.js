import * as React from 'react';
import { useSelector } from 'react-redux';
import { selectUser, prefetchUser } from 'reducers/userSlice';
import { FullPageSpinner, FullPageErrorFallback } from 'components/lib';

import { client } from 'utils/api-client';
import store from 'app/store';
import * as auth from 'auth-provider';
import { prefetchListItem } from 'reducers/listItemSlice';

const AuthenticatedApp = React.lazy(() => import(/* webpackPrefetch: true */ './authenticated-app'));
const UnauthenticatedApp = React.lazy(() => import('./unauthenticated-app'));

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

function App() {
  const { status, user, error } = useSelector(selectUser);

  React.useEffect(() => {
    getPrefetchUser();
  }, []);

  const isIdle = status === 'idle';
  const isError = status === 'rejectedApp';
  if (isIdle) {
    return <FullPageSpinner />;
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />;
  }

  return (
    <React.Suspense fallback={<FullPageSpinner />}>
      {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </React.Suspense>
  );
}

export { App };
