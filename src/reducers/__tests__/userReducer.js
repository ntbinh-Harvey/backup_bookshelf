import React from 'react';
import { renderWaitLoading as render, screen } from 'test/app-test-utils';
import { App } from 'app';

test('can login or register', async () => {
  await render(<App />);
  screen.debug();
});
