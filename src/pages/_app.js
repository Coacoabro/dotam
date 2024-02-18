import { ApolloClient, InMemoryCache, createHttpLink, ApolloProvider, gql } from '@apollo/client';
import { onError } from "@apollo/client/link/error";
import { setContext } from '@apollo/client/link/context';
import "../styles/tailwind.css";
import { useEffect } from "react";
import Layout from '../components/Layout'
require('dotenv').config()

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

const token = process.env.NEXT_PUBLIC_REACT_APP_TOKEN;

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