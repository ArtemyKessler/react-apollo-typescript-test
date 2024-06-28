import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {SERVER_URL} from "./helpers/consts.ts";

const client = new ApolloClient({
    uri: SERVER_URL,
    cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <ApolloProvider client={client}>
          <App />
      </ApolloProvider>
  </React.StrictMode>,
)
