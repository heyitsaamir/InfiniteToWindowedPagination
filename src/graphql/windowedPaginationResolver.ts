import { getPaginationArgs, Request } from "./common";
import { paginator } from "./paginator";

export const windowedPaginatedUsers = (_: any, { after, before, first, last }: Request) => {
  const paginationArgs = getPaginationArgs(after, before, first, last);
  let edges = paginator.edges(paginationArgs);
  const totalCount = paginator.count(paginationArgs);
  const remainingCount = paginator.countRemaining(paginationArgs);

  const { direction } = paginationArgs;

  const hasNext = direction === 'forward' ? remainingCount > edges.length : remainingCount < totalCount;
  const hasPrevious = direction === 'backward' ? remainingCount > edges.length : remainingCount < totalCount;

  const startOfPage = direction === 'forward' ? totalCount - remainingCount : remainingCount - edges.length;
  const endOfPage = (direction === 'forward' ? startOfPage + edges.length : remainingCount) - 1;

  return {
    edges,
    pageInfo: {
      hasNext,
      hasPrevious,
      startCursor: edges[0]?.cursor,
      endCursor: edges[edges.length - 1]?.cursor
    },
    count: totalCount,
    edgeRange: {
      start: startOfPage,
      end: endOfPage
    },
  }
};