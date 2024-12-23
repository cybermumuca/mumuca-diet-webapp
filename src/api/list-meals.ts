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
  const { sort = "title,asc", size = 10, page = 0 } = query;

  const sortOrder = sort.toLowerCase() === "desc" ? "title,desc" : sort;

  const response = await api.get<ListMealsResponse>("/v1/meals", {
    params: {
      sort: sortOrder,
      size,
      page,
    },
  });

  return response.data;
}