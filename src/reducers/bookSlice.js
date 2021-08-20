import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from 'utils/api-client';
import bookPlaceholderSvg from 'assets/book-placeholder.svg';

const status = {
  pending: 'pending',
  resolved: 'resolved',
  rejected: 'rejected',
};

const loadingBook = {
  title: 'Loading...',
  author: 'Loading...',
  coverImageUrl: bookPlaceholderSvg,
  publisher: 'Loading Publishing',
  synopsis: 'Loading...',
  loadingBook: true,
};

const loadingBooks = Array.from({ length: 10 }, (v, index) => ({
  id: `loading-book-${index}`,
  ...loadingBook,
}));

const initialState = {
  status: 'idle',
  book: loadingBook,
  books: loadingBooks,
  error: null,
};

const getBookListByQuery = createAsyncThunk('book/getBookListByQuery', async (query) => {
  const { books } = await client(`books?query=${encodeURIComponent(query)}`);
  return books;
});

const getBook = createAsyncThunk('book/getBook', async (bookId) => {
  const { book } = await client(`books/${bookId}`);
  return book;
});

export const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    resetBookListQuery: (state) => {
      state.books = initialState.books;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBookListByQuery.pending, (state) => {
        state.status = status.pending;
      })
      .addCase(getBook.pending, (state) => {
        state.status = status.pending;
        state.book = loadingBook;
      })
      .addCase(getBookListByQuery.fulfilled, (state, action) => {
        state.status = status.resolved;
        state.books = action.payload;
      })
      .addCase(getBook.fulfilled, (state, action) => {
        state.status = status.resolved;
        state.book = action.payload;
      })
      .addCase(getBookListByQuery.rejected, (state, action) => {
        state.status = status.rejected;
        state.error = action.error;
      })
      .addCase(getBook.rejected, (state, action) => {
        state.status = status.rejected;
        state.error = action.error;
      });
  },
});

export const { resetBookListQuery } = bookSlice.actions;

export { getBookListByQuery, getBook };

export const selectABook = (stateStore) => stateStore.book.book;

export const selectBookList = (stateStore) => stateStore.book.books;

export const selectStatus = (stateStore) => stateStore.book.status;

export const selectError = (stateStore) => stateStore.book.error;

export const selectBookState = (stateStore) => stateStore.book;

export default bookSlice.reducer;
