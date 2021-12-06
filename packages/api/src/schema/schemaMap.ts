import 'graphql-import-node';
import * as FooObjectSchema from './fooObject.graphql';
import * as EmptySchema from './empty.graphql';
import Resolvers from '../resolvers/resolversMap';
import { makeExecutableSchema } from '@graphql-tools/schema';

const schema = makeExecutableSchema({ typeDefs: [EmptySchema, FooObjectSchema], resolvers: Resolvers });

export default schema;