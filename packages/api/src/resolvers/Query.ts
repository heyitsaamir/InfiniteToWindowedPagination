import { QueryResolvers, Scalars } from "../generated/graphql";

export const Query: QueryResolvers = {
  async getObjects() {
    return [{
      id: 'id',
      name: 'name',
      value: 'val',
    }]
  }
}