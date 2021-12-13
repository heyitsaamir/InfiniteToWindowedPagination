import { makeExecutableSchema } from '@graphql-tools/schema'
import { addMocksToSchema } from '@graphql-tools/mock'
import { graphql } from 'graphql'
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

  type UsersConnection {
    edges: [UsersEdge!]!
    pageInfo: PageInfo!
  }

  type Query {
    users: [User!]
    paginatedUsers(after: Int, before: Int, first: Int, last: Int): UsersConnection!
  }
`
// Make a GraphQL schema with no resolvers
const schema = makeExecutableSchema({ typeDefs: schemaString })

const users = _.times(25, (i) => ({ id: i, name: faker.name.firstName() }))

interface User {
  id: number;
  name: string;
}

const paginator: {
  edges: (after?: number, before?: number, first?: number, last?: number) =>
    {
      edges: { node: User; cursor: number }[];
      hasMore: boolean
    }
} = {
  edges: (after, before, first, last) => {
    if (before != null || last != null) {
      const beforeCursor = before ?? users.length;
      const lastRes = (last ?? 5);
      const edges = users.slice(Math.max(beforeCursor - lastRes, 0), beforeCursor).map(u => ({ node: u, cursor: u.id }));
      const hasMore = beforeCursor > lastRes;
      if (edges.length > lastRes) {
        edges.splice(0);
      }
      return {
        edges,
        hasMore,
      }
    } else {
      const afterCursor = after ?? -1;
      const firstRes = first ?? 5;
      const edges = users.slice(afterCursor + 1, Math.min(afterCursor + 1 + firstRes, users.length)).map(u => ({ node: u, cursor: u.id }));
      const hasMore = afterCursor + 1 + firstRes <= users.length;
      if (edges.length > firstRes) {
        edges.pop();
      }

      return {
        edges,
        hasMore,
      }
    }
  }
}

// Create a new schema with mocks
const schemaWithMocks = addMocksToSchema({
  schema, resolvers: {
    Query: {
      users() {
        return []
      },
      paginatedUsers(_, { after, before, first, last }) {
        const { edges, hasMore } = paginator.edges(after, before, first, last);
        return {
          edges: edges,
          pageInfo: {
            startCursor: edges[0]?.cursor,
            endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
            hasNext: hasMore,
            hasPrevious: false, // for infinite scroll this doesn't matter
          }
        }
      }
    }
  }
})

const query = /* GraphQL */ `
  query tasksForUser {
    users {
      id
      name
    }
    paginatedUsers {
      edges {
        node {
          id
          name
        }
        cursor
      }
      pageInfo {
        startCursor
        endCursor
        hasNext
        hasPrevious
      }
    }
  }
`

export const doWork = () => {
  return graphql(schemaWithMocks, query);
}