import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./reset.css";
import reportWebVitals from "./reportWebVitals";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://angular-test-backend-yc4c5cvnnq-an.a.run.app/graphql",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          fetchLatestMessages: {
            keyArgs: ["channelId"],
            merge(existing = [], incoming) {
              if (!Array.isArray(incoming)) incoming = [incoming];
              let n = 0;

              for (let i = 0; i < incoming.length; i++) {
                if (existing && incoming[i].messageId === existing[0]?.messageId) {
                  break;
                }
                n++;
              }

              return [...incoming.slice(0, n), ...existing];
            },
          },
          fetchMoreMessages: {
            keyArgs: ["channelId"],
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
        },
      },
      // Message: {
      //   keyFields: ["messageId"],
      // },
    },
  }),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
