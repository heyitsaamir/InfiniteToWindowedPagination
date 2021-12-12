import { makeExecutableSchema } from '@graphql-tools/schema'
import { addMocksToSchema } from '@graphql-tools/mock'
import { graphql } from 'graphql'

const schemaString = `
{
  hero {
    name
    appearsIn
  }
}
`
// Make a GraphQL schema with no resolvers
const schema = makeExecutableSchema({ typeDefs: schemaString })

// Create a new schema with mocks
const schemaWithMocks = addMocksToSchema({ schema })

const query = /* GraphQL */ `
  query tasksForUser {
    user(id: 6) {
      id
      name
    }
  }
`

export const doWork = () => {
  graphql(schemaWithMocks, query).then(result => console.log('Got result', result))
}