import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import schema from './schema/schemaMap';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';

const PORT = 4000;

const app = express();
const server = new ApolloServer({
  schema,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground({ })]
});

server.start().then(() => {
  server.applyMiddleware({ app, path: '/graphql'});
})

app.listen(PORT, () => {
  console.log(`\n🚀 Graphql Running on port 4000 (http://localhost:4000)`);
})