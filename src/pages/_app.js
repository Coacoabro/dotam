import { ApolloClient, InMemoryCache, createHttpLink, ApolloProvider, gql } from '@apollo/client';
import { onError } from "@apollo/client/link/error";
import { setContext } from '@apollo/client/link/context';
import "../styles/tailwind.css";
import { useEffect } from "react";
import Layout from '../components/Layout'

const errorLink = onError(({ graphqlErrors, networkError }) => {
  if (graphqlErrors) {
    graphqlErrors.map(({ message, location, path }) => {
      console.log(`Graphql error ${message}`);
      console.log('Location:', location);
      console.log('Path:', path);
    });
  }
  if (networkError) {
    console.log(`Network error: ${networkError}`);
  }
});

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJTdWJqZWN0IjoiZWNmMWMxNTktMzk5Yy00N2UzLWEyMTktNzZkNjA5MDNmMGE5IiwiU3RlYW1JZCI6Ijk2MTcwMTk2IiwibmJmIjoxNzAyNDM3NzczLCJleHAiOjE3MzM5NzM3NzMsImlhdCI6MTcwMjQzNzc3MywiaXNzIjoiaHR0cHM6Ly9hcGkuc3RyYXR6LmNvbSJ9.JKQ92J9j9QTh5HPtD8sxCSGkbOViKKuCtuBCD2QN0Yk';

const httpLink = createHttpLink({ uri: 'https://api.stratz.com/graphql' });

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        heroStats: {
          merge(existing, incoming) {
            // Define how to merge the existing and incoming data
            return { ...existing, ...incoming };
          },
        },
      },
    },
  },
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: cache,
});

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  )
}

export default MyApp;