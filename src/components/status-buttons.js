/** @jsx jsx */
import { jsx } from '@emotion/core';

import * as React from 'react';
import {
  FaCheckCircle,
  FaPlusCircle,
  FaMinusCircle,
  FaBook,
  FaTimesCircle,
} from 'react-icons/fa';
import Tooltip from '@reach/tooltip';
import { useDispatch } from 'react-redux';
import {
  updateListItem, removeListItem, addListItem,
} from 'reducers/listItemSlice';
import { useListItem, useAsync } from 'utils/hooks';
import * as colors from 'styles/colors';

import { CircleButton, Spinner } from './lib';

function TooltipButton({
  label, highlight, onClick, icon, ...rest
}) {
  const {
    isLoading, isError, error, run, reset,
  } = useAsync();

  function handleClick() {
    if (isError) {
      reset();
    } else {
      run(onClick());
    }
  }

  return (
    <Tooltip label={isError ? error.message : label}>
      <CircleButton
        css={{
          backgroundColor: 'white',
          ':hover,:focus': {
            color: isLoading
              ? colors.gray80
              : isError
                ? colors.danger
                : highlight,
          },
        }}
        disabled={isLoading}
        onClick={handleClick}
        aria-label={isError ? error.message : label}
        {...rest}
      >
        {isLoading ? <Spinner /> : isError ? <FaTimesCircle /> : icon}
      </CircleButton>
    </Tooltip>
  );
}

function StatusButtons({ book }) {
  const listItem = useListItem(book.id);
  const dispatch = useDispatch();
  const handleMarkAsReadOrUnread = (updates) => dispatch(updateListItem(updates));
  const handleRemoveClick = (id) => dispatch(removeListItem(id));
  const handleAddClick = (bookId) => dispatch(addListItem(bookId));

  return (
    <React.Fragment>
      {listItem ? (
        listItem.finishDate ? (
          <TooltipButton
            label="Mark as unread"
            highlight={colors.yellow}
            onClick={() => handleMarkAsReadOrUnread({ id: listItem.id, finishDate: null })}
            icon={<FaBook />}
          />
        ) : (
          <TooltipButton
            label="Mark as read"
            highlight={colors.green}
            onClick={() => handleMarkAsReadOrUnread({ id: listItem.id, finishDate: Date.now() })}
            icon={<FaCheckCircle />}
          />
        )
      ) : null}
      {listItem ? (
        <TooltipButton
          label="Remove from list"
          highlight={colors.danger}
          onClick={() => handleRemoveClick({ id: listItem.id })}
          icon={<FaMinusCircle />}
        />
      ) : (
        <TooltipButton
          label="Add to list"
          highlight={colors.indigo}
          onClick={() => handleAddClick({ bookId: book.id })}
          icon={<FaPlusCircle />}
        />
      )}
    </React.Fragment>
  );
}

export { StatusButtons };
