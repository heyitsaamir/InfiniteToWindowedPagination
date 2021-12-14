import _ from 'lodash';
import * as faker from 'faker';
import { PaginationArgs } from './common';

export interface User {
  id: number;
  name: string;
}

const users = _.times(26, (i) => ({ id: i, name: faker.name.firstName() }))

// This is mocking the data layer. This will be connected to a db most likely.
export const paginator: {
  edges: (paginationArgs: PaginationArgs) => { node: User; cursor: number }[];
  hasMore: (paginationArgs: PaginationArgs) => boolean;
  count: (paginationArgs: PaginationArgs) => number;
  countRemaining: (paginationArgs: PaginationArgs) => number;
} = {
  edges: ({ cursor: cursorNullable, limit, direction }) => {
    if (direction === 'backward') {
      const cursor = cursorNullable ?? users.length;
      const edges = users.slice(Math.max(cursor - limit, 0), cursor).map(u => ({ node: u, cursor: u.id }));
      return edges;
    } else {
      const cursor = cursorNullable ?? -1;
      const edges = users.slice(cursor + 1, Math.min(cursor + 1 + limit, users.length)).map(u => ({ node: u, cursor: u.id }));
      return edges;
    }
  },
  hasMore: ({ cursor: cursorNullable, limit, direction }) => {
    if (direction === 'backward') {
      const cursor = cursorNullable ?? users.length;
      return cursor > limit;
    } else {
      const cursor = cursorNullable ?? -1;
      return cursor + 1 < users.length;
    }
  },
  count: () => users.length,
  countRemaining: ({ cursor: cursorNullable, direction }) => {
    if (direction === 'backward') {
      return cursorNullable ?? users.length;
    } else {
      const cursor = cursorNullable ?? -1;
      const finalIndex = users.length - 1;
      return (finalIndex) - cursor;
    }
  }
}