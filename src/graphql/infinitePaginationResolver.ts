import { getPaginationArgs, Request } from "./common";
import { paginator } from "./paginator";

export const infinitePaginatedUsers = (_: any, { after, before, first, last }: Request) => {
  const paginationArgs = getPaginationArgs(after, before, first, last);
  const edges = paginator.edges(paginationArgs);
  const hasMore = paginator.hasMore(paginationArgs);
  return {
    edges: edges,
    pageInfo: {
      startCursor: edges[0]?.cursor,
      endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
      hasNext: hasMore,
      hasPrevious: false, // for infinite scroll this doesn't matter
    }
  }
}