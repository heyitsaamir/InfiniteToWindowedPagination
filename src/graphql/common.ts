export type Request = {
  after?: number;
  before?: number;
  first?: number;
  last?: number;
}

export type PaginationArgs = {
  cursor: number | null;
  direction: 'forward' | 'backward',
  limit: number;
}

export const getPaginationArgs = (after?: number, before?: number, first?: number, last?: number): PaginationArgs => {
  if (before != null || last != null) {
    const beforeCursor = before ?? null;
    const lastRes = (last ?? 5);
    return { cursor: beforeCursor, direction: 'backward', limit: lastRes }
  } else {
    const afterCursor = after ?? null;
    const firstRes = first ?? 5;
    return { cursor: afterCursor, direction: 'forward', limit: firstRes }
  }
}