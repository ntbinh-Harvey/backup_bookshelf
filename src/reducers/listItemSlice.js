import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from 'utils/api-client';

let oldListItem;

const initialState = {
  status: 'idle',
  listItems: [],
  error: null,
};

const getListItem = createAsyncThunk('listItems/getListItem', async () => {
  const { listItems } = client('list-items');
  return listItems;
});

const addListItem = createAsyncThunk('listItems/addListItem', async ({ bookId }) => {
  const { listItem } = await client('list-items', { data: { bookId } });
  return listItem;
});

const updateListItem = createAsyncThunk('listItems/updateListItem', async (updates) => {
  const { listItem } = await client(`list-items/${updates.id}`, {
    method: 'PUT',
    data: updates,
  });
  return listItem;
});

const removeListItem = createAsyncThunk('listItems/removeListItem', async ({ id }) => {
  await client(`list-items/${id}`, { method: 'DELETE' });
  return id;
});

export const listItemSlice = createSlice({
  name: 'listItems',
  initialState,
  reducers: {
    prefetchListItem: (state, action) => {
      state.status = action.payload.status;
      state.listItems = action.payload.listItems;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getListItem.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(addListItem.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(updateListItem.pending, (state, action) => {
        if (action.meta.arg.rating) {
          const { rating } = action.meta.arg;
          state.listItems = state.listItems.map((listItem) => {
            if (listItem.id === action.meta.arg.id) {
              oldListItem = listItem;
              return { ...listItem, rating };
            }
            return listItem;
          });
        }
        if (action.meta.arg.notes) {
          state.status = 'pending';
        }
      })
      .addCase(removeListItem.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(getListItem.fulfilled, (state, action) => {
        state.status = 'resolved';
        state.listItems = action.payload;
      })
      .addCase(addListItem.fulfilled, (state, action) => {
        state.status = 'resolved';
        state.listItems.unshift(action.payload);
      })
      .addCase(updateListItem.fulfilled, (state, action) => {
        state.status = 'resolved';
        state.listItems = state.listItems.map((listItem) => (listItem.id === action.payload.id ? action.payload : listItem));
      })
      .addCase(removeListItem.fulfilled, (state, action) => {
        state.status = 'resolved';
        const index = state.listItems.map((listItem) => listItem.id).indexOf(action.payload);
        state.listItems.splice(index, 1);
      })
      .addCase(getListItem.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.error;
      })
      .addCase(addListItem.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.error;
      })
      .addCase(updateListItem.rejected, (state, action) => {
        // if (action.meta.arg.rating) {
        //   state.listItems = state.listItems.map((listItem) => (listItem.id === action.meta.arg.id ? oldListItem : listItem));
        // }
        state.status = 'rejected';
        state.error = action.error;
      })
      .addCase(removeListItem.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.error;
      });
  },
});

export const { prefetchListItem } = listItemSlice.actions;

export {
  getListItem, addListItem, updateListItem, removeListItem,
};

export const selectListItemState = (stateStore) => stateStore.listItem;

export const selectListItem = (stateStore) => stateStore.listItem.listItems;

export const selectStatusListItem = (stateStore) => stateStore.listItem.status;

export const selectErrorListItem = (stateStore) => stateStore.listItem.error;

export default listItemSlice.reducer;
