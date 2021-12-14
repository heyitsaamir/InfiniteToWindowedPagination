import { makeExecutableSchema } from '@graphql-tools/schema'
import { addMocksToSchema } from '@graphql-tools/mock'
import { windowedPaginatedUsers } from './windowedPaginationResolver'
import { infinitePaginatedUsers } from './infinitePaginationResolver'

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
    infinitePaginatedUsers(after: Int, before: Int, first: Int, last: Int): InfinitePaginationConnection!
    windowedPaginatedUsers(after: Int, before: Int, first: Int, last: Int): WindowedPaginationConnection!
  }
`
// Make a GraphQL schema with no resolvers
const schema = makeExecutableSchema({ typeDefs: schemaString })

// Create a new schema with mocks
export const schemaWithMocks = addMocksToSchema({
  schema, resolvers: {
    Query: {
      infinitePaginatedUsers,
      windowedPaginatedUsers,
    }
  }
})