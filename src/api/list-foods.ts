import { api } from "@/lib/axios";
import { Food } from "@/types/food";
import { Pagination } from "@/types/api";

export interface ListFoodsQuery {
  sort?: "asc" | "desc";
  size?: number;
  page?: number;
}

export interface ListFoodsResponse {
  content: Food[];
  page: Pagination;
}

export async function listFoods(
  query: ListFoodsQuery = {}
): Promise<ListFoodsResponse> {
  const { sort = "title,asc", size = 10, page = 0 } = query;

  const sortOrder = sort.toLowerCase() === "desc" ? "title,desc" : sort;

  const response = await api.get<ListFoodsResponse>("/v1/foods", {
    params: {
      sort: sortOrder,
      size,
      page,
    },
  });

  return response.data;
}
