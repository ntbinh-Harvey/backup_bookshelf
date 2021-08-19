import * as React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from 'reducers/userSlice';
import { FullPageSpinner, FullPageErrorFallback } from 'components/lib';

const AuthenticatedApp = React.lazy(() => import(/* webpackPrefetch: true */ './authenticated-app'));
const UnauthenticatedApp = React.lazy(() => import('./unauthenticated-app'));

function App() {
  const { status, user, error } = useSelector(selectUser);
  const isIdle = status === 'idle';
  const isError = status === 'rejectedApp';
  if (isIdle) {
    return <FullPageSpinner />;
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />;
  }

  // if (isSuccess) {
  return (
    <React.Suspense fallback={<FullPageSpinner />}>
      {/* {status !== 'resolved' ? <FullPageSpinner /> : user ? <AuthenticatedApp /> : <UnauthenticatedApp />} */}
      {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </React.Suspense>
  );
  // }
}

export { App };
