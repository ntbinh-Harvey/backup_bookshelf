import * as React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from 'reducers/userSlice';
// import { useAuth } from './context/auth-context';
import { FullPageSpinner, FullPageErrorFallback } from 'components/lib';

const AuthenticatedApp = React.lazy(() => import(/* webpackPrefetch: true */ './authenticated-app'));
const UnauthenticatedApp = React.lazy(() => import('./unauthenticated-app'));

function App() {
  const { status, user, error } = useSelector(selectUser);
  const isIdle = status === 'idle';
  const isLoading = status === 'pending';
  const isSuccess = status === 'resolved';
  const isError = status === 'rejected';
  // const { user } = useAuth();
  if (isLoading || isIdle) {
    return <FullPageSpinner />;
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />;
  }

  if (isSuccess) {
    return (
      <React.Suspense fallback={<FullPageSpinner />}>
        {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
      </React.Suspense>
    );
  }
}

export { App };
