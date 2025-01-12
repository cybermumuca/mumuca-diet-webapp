import { api } from "@/lib/axios";

export type UpdateBodyBody = {
  weight: number;
  height: number;
  date: string;
}

export async function updateBody(bodyId: string, data: UpdateBodyBody) {
  await api.put(`/v1/bodies/${bodyId}`, data);
}