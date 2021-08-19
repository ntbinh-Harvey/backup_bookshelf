import { configureStore } from '@reduxjs/toolkit';
import userSlice from 'reducers/userSlice';
import bookSlice from 'reducers/bookSlice';
import listItemSlice from 'reducers/listItemSlice';
// middleware that log all actions
const logAllActionsMiddleware = (storeAPI) => (next) => (action) => {
  console.group(action.type);
  console.log('%c prev state', 'color: gray', storeAPI.getState());
  console.log('%c action', 'color: blue', action);
  const returnValue = next(action);
  console.log('%c next state', 'color: green', storeAPI.getState());
  console.groupEnd(action.type);
  return returnValue;
};

const store = configureStore({
  reducer: {
    user: userSlice,
    book: bookSlice,
    listItem: listItemSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logAllActionsMiddleware),
});

export default store;
