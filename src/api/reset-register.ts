import { api } from "@/lib/axios";

export async function resetRegister() {
  await api.delete("/v1/me/register")
}