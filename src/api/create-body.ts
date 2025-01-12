import { api } from "@/lib/axios";
import { Body } from "@/types/body";

type CreateBodyBody = {
  weight: number;
  height: number;
  date: string;
}

export async function createBody(data: CreateBodyBody): Promise<Body> {
  const response = await api.post<Body>(`/v1/bodies`, data);

  return response.data;
}