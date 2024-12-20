import { api } from "@/lib/axios";
import { Pagination } from "@/types/api";
import { Meal } from "@/types/meal";

export interface ListMealsQuery {
  sort?: string;
  size?: number;
  page?: number;
}

export interface ListMealsResponse {
  content: Meal[];
  page: Pagination;
}

export async function listMeals(query: ListMealsQuery = {}): Promise<ListMealsResponse> {
  const { sort = "title", size = 20, page = 0 } = query;

  const response = await api.get<ListMealsResponse>("/v1/meals", {
    params: {
      sort,
      size,
      page,
    },
  });

  return response.data;
}