import { gql, useQuery } from "@apollo/client";

const paginatedQuery = gql`
  query tasksForUser($after: Int) {
    infinitePaginatedUsers(after: $after) {
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
    }
  }
`;

export const InfiniteList = () => {
  const { data, loading, error, fetchMore } = useQuery(paginatedQuery);
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
        {data?.infinitePaginatedUsers?.pageInfo.hasNext ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              fetchMore({
                variables: {
                  after: data?.infinitePaginatedUsers?.pageInfo.endCursor,
                },
              });
            }}
          >
            Go Next
          </button>
        ) : (
          <span>End of list</span>
        )}
        <table>
          <thead>
            <tr style={{ outline: "1px solid black" }}>
              <th>Id</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {data?.infinitePaginatedUsers.edges.map((e: any) => {
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
