import { GraphQLClient } from 'graphql-request';

const ENDPOINT = process.env.GRAPHQL_ENDPOINT || 'http://localhost:3000/api/graphql';

export const graphQLClient = new GraphQLClient(ENDPOINT, {
  credentials: 'include',
});
