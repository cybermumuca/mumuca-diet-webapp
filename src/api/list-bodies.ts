import { api } from "@/lib/axios";
import { Pagination } from "@/types/api";
import { Body } from "@/types/body";

export interface ListBodiesQuery {
  sort?: "asc" | "desc";
  size?: number;
  page?: number;
}

export interface ListBodiesResponse {
  content: Body[];
  page: Pagination;
}

export async function listBodies(
  query: ListBodiesQuery = {}
): Promise<ListBodiesResponse> {
  const { sort = "date,desc", size = 10, page = 0 } = query;

  const sortOrder = sort.toLowerCase() === "desc" ? "date,desc" : sort;

  const response = await api.get<ListBodiesResponse>("/v1/bodies", {
    params: {
      sort: sortOrder,
      size,
      page,
    },
  });

  return response.data;
}
