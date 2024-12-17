import { api } from "@/lib/axios";

export interface SignInRequest {
  email: string;
  password: string;
}

// TODO: save the access token to keep the user logged in
export async function signIn({
  email,
  password,
}: SignInRequest) {
  const response = await api.post("/v1/auth/sign-in", {
    email,
    password,
  });

  const accessToken = response.data.accessToken;

  api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
}
