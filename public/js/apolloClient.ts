/// <reference types="vite/client" />
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// Read Vite env safely, with fallback for build or serverless environments
const GRAPHQL_URL = (import.meta as any).env?.VITE_GRAPHQL_URL ?? (process.env.VITE_GRAPHQL_URL as string) ?? 'http://localhost:4000/graphql';

const httpLink = new HttpLink({ uri: GRAPHQL_URL });

const client = new ApolloClient({ link: httpLink, cache: new InMemoryCache() });

export default client;
