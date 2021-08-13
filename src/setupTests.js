import '@testing-library/jest-dom/extend-expect'
import  {act} from '@testing-library/react'
import * as auth from 'auth-provider'
import {server} from 'test/server'
import * as usersDB from 'test/data/users'
import * as listItemsDB from 'test/data/list-items'
import * as booksDB from 'test/data/books'


// enable API mocking in test runs using the same request handlers
// as for the client-side mocking.
beforeAll(() => server.listen({onUnhandledRequest: 'error'}))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

