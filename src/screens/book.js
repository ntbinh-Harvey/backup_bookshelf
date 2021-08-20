/** @jsx jsx */
import { jsx } from '@emotion/core';

import * as React from 'react';
import debounceFn from 'debounce-fn';
import { useDispatch, useSelector } from 'react-redux';
import { getBook, selectCurrentBook, selectError } from 'reducers/bookSlice';
import {
  updateListItem, selectStatusListItem, selectErrorListItem,
} from 'reducers/listItemSlice';
import { FaRegCalendarAlt } from 'react-icons/fa';
import Tooltip from '@reach/tooltip';
import { useParams } from 'react-router-dom';
import { formatDate } from 'utils/misc';
import { useListItem } from 'utils/hooks';
import * as mq from 'styles/media-queries';
import * as colors from 'styles/colors';
import { Spinner, Textarea, ErrorMessage } from 'components/lib';
import { Rating } from 'components/rating';
import { Profiler } from 'components/profiler';
import { StatusButtons } from 'components/status-buttons';

function BookScreen() {
  const { bookId } = useParams();
  const listItem = useListItem(bookId);
  const dispatch = useDispatch();
  const book = useSelector(selectCurrentBook);
  const error = useSelector(selectError);
  if (error) throw error;
  React.useEffect(() => {
    dispatch(getBook(bookId));
  }, [bookId, dispatch]);
  const {
    title, author, coverImageUrl, publisher, synopsis,
  } = book;

  return (
    <Profiler id="Book Screen" metadata={{ bookId, listItemId: listItem?.id }}>
      <div>
        <div
          css={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gridGap: '2em',
            marginBottom: '1em',
            [mq.small]: {
              display: 'flex',
              flexDirection: 'column',
            },
          }}
        >
          <img
            src={coverImageUrl}
            alt={`${title} book cover`}
            css={{ width: '100%', maxWidth: '14rem' }}
          />
          <div>
            <div css={{ display: 'flex', position: 'relative' }}>
              <div css={{ flex: 1, justifyContent: 'space-between' }}>
                <h1>{title}</h1>
                <div>
                  <i>{author}</i>
                  <span css={{ marginRight: 6, marginLeft: 6 }}>|</span>
                  <i>{publisher}</i>
                </div>
              </div>
              <div
                css={{
                  right: 0,
                  color: colors.gray80,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  minHeight: 100,
                }}
              >
                {book.loadingBook ? null : <StatusButtons book={book} />}
              </div>
            </div>
            <div css={{ marginTop: 10, minHeight: 46 }}>
              {listItem?.finishDate ? <Rating listItem={listItem} /> : null}
              {listItem ? <ListItemTimeframe listItem={listItem} /> : null}
            </div>
            <br />
            <p css={{ whiteSpace: 'break-spaces', display: 'block' }}>
              {synopsis}
            </p>
          </div>
        </div>
        {!book.loadingBook && listItem ? (
          <NotesTextarea listItem={listItem} />
        ) : null}
      </div>
    </Profiler>
  );
}

function ListItemTimeframe({ listItem }) {
  const timeframeLabel = listItem.finishDate
    ? 'Start and finish date'
    : 'Start date';

  return (
    <Tooltip label={timeframeLabel}>
      <div aria-label={timeframeLabel} css={{ marginTop: 6 }}>
        <FaRegCalendarAlt css={{ marginTop: -2, marginRight: 5 }} />
        <span>
          {formatDate(listItem.startDate)}
          {' '}
          {listItem.finishDate ? `— ${formatDate(listItem.finishDate)}` : null}
        </span>
      </div>
    </Tooltip>
  );
}

function NotesTextarea({ listItem }) {
  const status = useSelector(selectStatusListItem);
  const error = useSelector(selectErrorListItem);
  const isError = status === 'rejected';
  const isLoading = status === 'pending';
  const dispatch = useDispatch();
  const handleSendNote = React.useCallback((updates) => dispatch(updateListItem(updates)), [dispatch]);

  const debouncedMutate = React.useMemo(() => debounceFn(handleSendNote, { wait: 300 }), [
    handleSendNote,
  ]);

  function handleNotesChange(e) {
    debouncedMutate({ id: listItem.id, notes: e.target.value });
  }

  return (
    <React.Fragment>
      <div>
        <label
          htmlFor="notes"
          css={{
            display: 'inline-block',
            marginRight: 10,
            marginTop: '0',
            marginBottom: '0.5rem',
            fontWeight: 'bold',
          }}
        >
          Notes
        </label>
        {isError ? (
          <ErrorMessage
            variant="inline"
            error={error}
            css={{ fontSize: '0.7em' }}
          />
        ) : null}
        {isLoading ? <Spinner /> : null}
      </div>
      <Textarea
        id="notes"
        defaultValue={listItem.notes}
        onChange={handleNotesChange}
        css={{ width: '100%', minHeight: 300 }}
      />
    </React.Fragment>
  );
}

export { BookScreen };
