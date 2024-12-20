import { api } from "@/lib/axios";
import { Food } from "@/types/food";
import { Pagination } from "@/types/api";

export interface ListFoodsQuery {
  sort?: string;
  size?: number;
  page?: number;
}

export interface ListFoodsResponse {
  content: Food[];
  page: Pagination;
}

export async function listFoods(query: ListFoodsQuery = {}): Promise<ListFoodsResponse> {
  const { sort = "title", size = 20, page = 0 } = query;

  const response = await api.get<ListFoodsResponse>("/v1/foods", {
    params: {
      sort,
      size,
      page,
    },
  });

  return response.data;
}