import { api } from "@/lib/axios";

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export async function signUp({
  firstName,
  lastName,
  email,
  password,
}: SignUpRequest) {
  await api.post("/v1/auth/sign-up", {
    firstName,
    lastName,
    email,
    password,
  });
}
