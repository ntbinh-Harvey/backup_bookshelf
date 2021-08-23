/** @jsx jsx */
import { jsx } from '@emotion/core';

import { Link } from 'components/lib';

function NotFoundScreen({ to, linkMessage }) {
  return (
    <div
      css={{
        height: '100%',
        display: 'grid',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div>
        Sorry... nothing here.
        {' '}
        <Link to={to}>{linkMessage}</Link>
      </div>
    </div>
  );
}

export { NotFoundScreen };
