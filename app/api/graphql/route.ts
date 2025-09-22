import {NextRequest} from 'next/server';
import {ApolloServer} from '@apollo/server';
import {startServerAndCreateNextHandler} from '@as-integrations/next';
import {typeDefs, resolvers} from '../../../lib/graphql/schema';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});
const handler = startServerAndCreateNextHandler(server);

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}
