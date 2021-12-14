import { gql, useQuery } from "@apollo/client";
import { useState } from "react";

const paginatedQuery = gql`
  query tasksForUser($after: Int, $before: Int) {
    windowedPaginatedUsers(after: $after, before: $before) {
      edges {
        node {
          id
          name
        }
        cursor
      }
      pageInfo {
        startCursor
        endCursor
        hasNext
        hasPrevious
      }
      count
      edgeRange {
        start
        end
      }
    }
  }
`;

export const WindowedList = () => {
  const [cursor, setCursor] = useState<{
    after: number | null;
    before: number | null;
  } | null>(null);
  const { data, loading, error } = useQuery(paginatedQuery, {
    variables: {
      ...cursor,
    },
  });
  if (loading) {
    return <span>loading</span>;
  }
  if (error) {
    return <span>{error}</span>;
  }
  return (
    <div className="container">
      <pre className="code-display">{JSON.stringify(data, undefined, 2)}</pre>
      <div>
        <p>
          {data?.windowedPaginatedUsers?.edgeRange &&
            `Showing ${data?.windowedPaginatedUsers?.edgeRange.start} - ${data?.windowedPaginatedUsers?.edgeRange.end} of ${data?.windowedPaginatedUsers?.count}`}
        </p>
        {data?.windowedPaginatedUsers?.pageInfo.hasNext && (
          <button
            onClick={(e) => {
              e.preventDefault();
              setCursor({
                after: data?.windowedPaginatedUsers?.pageInfo.endCursor,
                before: null,
              });
            }}
          >
            Go Next
          </button>
        )}
        {data?.windowedPaginatedUsers?.pageInfo.hasPrevious && (
          <button
            onClick={(e) => {
              e.preventDefault();
              setCursor({
                before: data?.windowedPaginatedUsers?.pageInfo.startCursor,
                after: null,
              });
            }}
          >
            Go Previous
          </button>
        )}
        <table>
          <thead>
            <tr style={{ outline: "1px solid black" }}>
              <th>Id</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {data?.windowedPaginatedUsers.edges.map((e: any) => {
              return (
                <tr style={{ outline: "1px solid black" }}>
                  <td style={{ width: 50, textAlign: "center" }}>
                    {e.node.id}
                  </td>
                  <td>{e.node.name}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
