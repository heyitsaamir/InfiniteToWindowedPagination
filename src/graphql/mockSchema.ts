import { makeExecutableSchema } from '@graphql-tools/schema'
import { addMocksToSchema } from '@graphql-tools/mock'
import _ from 'lodash';
import * as faker from 'faker';

const schemaString = `
  type User {
    id: ID!
    name: String!
  }

  type PageInfo {
    startCursor: Int
    endCursor: Int
    hasNext: Boolean
    hasPrevious: Boolean
  }

  type UsersEdge {
    node: User!
    cursor: Int!
  }

  type InfinitePaginationConnection {
    edges: [UsersEdge!]!
    pageInfo: PageInfo!
  }

  type EdgeRange {
    start: Int!
    end: Int!
  }

  type WindowedPaginationConnection {
    edges: [UsersEdge!]!
    pageInfo: PageInfo!
    count: Int!
    edgeRange: EdgeRange
  }

  type Query {
    users: [User!]
    infinitePaginatedUsers(after: Int, before: Int, first: Int, last: Int): InfinitePaginationConnection!
    windowedPaginatedUsers(after: Int, before: Int, first: Int, last: Int): WindowedPaginationConnection!
  }
`
// Make a GraphQL schema with no resolvers
const schema = makeExecutableSchema({ typeDefs: schemaString })

const users = _.times(100, (i) => ({ id: i, name: faker.name.firstName() }))

interface User {
  id: number;
  name: string;
}

type PaginationArgs = {
  cursor: number;
  direction: 'forward' | 'backward',
  limit: number;
}

const getPaginationArgs = (after?: number, before?: number, first?: number, last?: number): PaginationArgs => {
  if (before != null || last != null) {
    const beforeCursor = before ?? users.length;
    const lastRes = (last ?? 5);
    return { cursor: beforeCursor, direction: 'backward', limit: lastRes }
  } else {
    const afterCursor = after ?? -1;
    const firstRes = first ?? 5;
    return { cursor: afterCursor, direction: 'forward', limit: firstRes }
  }
}

const paginator: {
  edges: (paginationArgs: PaginationArgs) => { node: User; cursor: number }[];
  hasMore: (paginationArgs: PaginationArgs) => boolean;
  count: (paginationArgs: PaginationArgs) => number;
  countRemaining: (paginationArgs: PaginationArgs) => number;
} = {
  edges: ({ cursor, limit, direction }) => {
    if (direction === 'backward') {
      const edges = users.slice(Math.max(cursor - limit, 0), cursor).map(u => ({ node: u, cursor: u.id }));
      return edges;
    } else {
      const edges = users.slice(cursor + 1, Math.min(cursor + 1 + limit, users.length)).map(u => ({ node: u, cursor: u.id }));
      return edges;
    }
  },
  hasMore: ({ cursor, limit, direction }) => {
    if (direction === 'backward') {
      return cursor > limit;
    } else {
      return cursor + 1 + cursor < users.length;
    }
  },
  count: () => users.length,
  countRemaining: ({ cursor, direction }) => {
    if (direction === 'backward') {
      return cursor;
    } else {
      const finalIndex = users.length - 1;
      return (finalIndex) - cursor;
    }
  }
}

// Create a new schema with mocks
export const schemaWithMocks = addMocksToSchema({
  schema, resolvers: {
    Query: {
      users() {
        return []
      },
      infinitePaginatedUsers(_, { after, before, first, last }) {
        const paginationArgs = getPaginationArgs(after, before, first, last);
        const edges = paginator.edges(paginationArgs);
        const hasMore = paginator.hasMore(paginationArgs);
        return {
          edges: edges,
          pageInfo: {
            startCursor: edges[0]?.cursor,
            endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
            hasNext: hasMore,
            hasPrevious: false, // for infinite scroll this doesn't matter
          }
        }
      },
      windowedPaginatedUsers(_, { after, before, first, last }) {
        const paginationArgs = getPaginationArgs(after, before, first, last);
        let edges = paginator.edges(paginationArgs);
        const totalCount = paginator.count(paginationArgs);
        const remainingCount = paginator.countRemaining(paginationArgs);

        const { direction } = paginationArgs;

        const hasNext = direction === 'forward' ? remainingCount > edges.length : remainingCount < totalCount;
        const hasPrevious = direction === 'backward' ? remainingCount > edges.length : remainingCount < totalCount;

        const startOfPage = direction === 'forward' ? totalCount - remainingCount : remainingCount - edges.length;
        const endOfPage = (direction === 'forward' ? startOfPage + edges.length : remainingCount) - 1;

        return {
          edges,
          pageInfo: {
            hasNext,
            hasPrevious,
            startCursor: edges[0]?.cursor,
            endCursor: edges[edges.length - 1]?.cursor
          },
          count: totalCount,
          edgeRange: {
            start: startOfPage,
            end: endOfPage
          },
        }
      },
    }
  }
})