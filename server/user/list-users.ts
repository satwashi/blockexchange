import { UserType } from "@/types/user";
import { admin } from "@/utils/auth-client";

export interface ListUsersQuery {
  searchValue?: string;
  searchField?: "name" | "email";
  searchOperator?: "contains" | "starts_with" | "ends_with";
  limit?: number;
  page?: number;
  offset?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  filterField?: string;
  filterValue?: string | number | boolean;
  filterOperator?: "eq" | "ne" | "lt" | "lte" | "gt" | "gte";
}

export interface NormalizedListUsersResponse {
  users: UserType[];
  total: number;
  limit: number;
  offset: number;
}

const listUsers = async ({
  query = {},
}: { query?: ListUsersQuery } = {}): Promise<NormalizedListUsersResponse> => {
  const { limit = 100, offset = 0 } = query;

  try {
    const { data, error } = await admin.listUsers({ query });

    if (error) throw new Error(error.message);

    // Normalize the response here
    const normalized: NormalizedListUsersResponse = {
      users: data?.users ?? [],
      total: data?.total ?? 0,
      limit: (data as any)?.limit ?? limit, // force TS to see it exists
      offset: (data as any)?.offset ?? offset,
    };

    return normalized;
  } catch (err: any) {
    console.error("Error fetching users:", err);
    return {
      users: [],
      total: 0,
      limit,
      offset,
    };
  }
};

export default listUsers;
