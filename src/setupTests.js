import '@testing-library/jest-dom/extend-expect';
import { act } from '@testing-library/react';
import * as auth from 'auth-provider';
import { server } from 'test/server';
import * as usersDB from 'test/data/users';
import * as listItemsDB from 'test/data/list-items';
import * as booksDB from 'test/data/books';

jest.mock('components/profiler');

window.history.pushState({}, 'Test page', '/list');

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

afterEach(async () => {
  await Promise.all([
    auth.logout(),
    usersDB.reset(),
    booksDB.reset(),
    listItemsDB.reset(),
  ]);
});

// real times is a good default to start, individual tests can
// enable fake timers if they need, and if they have, then we should
// run all the pending timers (in `act` because this can trigger state updates)
// then we'll switch back to realTimers.
// it's important this comes last here because jest runs afterEach callbacks
// in reverse order and we want this to be run first so we get back to real timers
// before any other cleanup
afterEach(async () => {
  if (jest.isMockFunction(setTimeout)) {
    act(() => jest.runOnlyPendingTimers());
    jest.useRealTimers();
  }
});
