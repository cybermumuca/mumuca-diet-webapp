import { api } from "@/lib/axios";

export async function deleteBody(bodyId: string) {
  await api.delete(`/v1/bodies/${bodyId}`);
}
