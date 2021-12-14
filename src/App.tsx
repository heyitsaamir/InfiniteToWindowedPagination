import "./App.css";
import { schemaWithMocks } from "./graphql/mockSchema";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { SchemaLink } from "@apollo/client/link/schema";
import { InfiniteList } from "./InfiniteList";
import { relayStylePagination } from "@apollo/client/utilities";
import { WindowedList } from "./WindowedList";
import { useState } from "react";

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          infinitePaginatedUsers: relayStylePagination(),
        },
      },
    },
  }),
  link: new SchemaLink({ schema: schemaWithMocks }),
});

const tabStyle = (isActive: boolean) => ({
  flex: 1,
  height: 30,
  background: isActive ? "#eee" : "#ddd",
  paddingInline: 10,
  alignItems: "center",
  display: "flex",
  fontWeight: isActive ? 800 : 400,
  cursor: "pointer",
});

function App() {
  const [list, setList] = useState<"infinite" | "windowed">("infinite");
  return (
    <ApolloProvider client={client}>
      <div style={{ display: "flex", justifyItems: "center" }}>
        <div
          style={tabStyle(list === "infinite")}
          onClick={() => setList("infinite")}
        >
          Infinite
        </div>
        <div
          style={tabStyle(list === "windowed")}
          onClick={() => setList("windowed")}
        >
          Windowed
        </div>
      </div>
      {list === "infinite" ? <InfiniteList /> : <WindowedList />}
    </ApolloProvider>
  );
}

export default App;
