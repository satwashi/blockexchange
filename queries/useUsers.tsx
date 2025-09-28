"use client";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import listUsers, {
  ListUsersQuery,
  NormalizedListUsersResponse,
} from "@/server/user/list-users";

export const useListUsers = ({
  page = 1,
  limit = 10,
  searchValue,
  searchField = "email",
  sortBy,
  sortDirection,
  filterField,
  filterValue,
  filterOperator,
}: ListUsersQuery) => {
  const offset = (page - 1) * limit;

  const queryOptions: UseQueryOptions<NormalizedListUsersResponse, Error> = {
    queryKey: ["users", page, limit, searchValue, sortBy, filterValue],
    queryFn: () =>
      listUsers({
        query: {
          limit,
          offset,
          searchValue,
          searchField,
          sortBy,
          sortDirection,
          filterField,
          filterValue,
          filterOperator,
        },
      }),
  };

  const { data, isLoading, error } = useQuery(queryOptions);

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  return {
    users: data?.users ?? [],
    total: data?.total ?? 0,
    totalPages,
    currentPage: page,
    isLoading,
    error,
  };
};
