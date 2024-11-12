import type { AppProps } from 'next/app'
import client from '../../lib/apollo';
import { ApolloProvider } from '@apollo/client';
import '../styles/app.css';
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}