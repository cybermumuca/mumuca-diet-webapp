import { signIn, SignInRequest } from "@/api/sign-in";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

import { Helmet } from "react-helmet-async";
import { useForm, useWatch } from "react-hook-form";
import { Link, useSearchParams } from "react-router";
import { toast } from "sonner";

type SignInSchema = {
  email: string;
  password: string;
};

export function SignIn() {
  const [searchParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    control,
    formState: { isSubmitting, errors },
  } = useForm<SignInSchema>({
    defaultValues: {
      email: searchParams.get("hint") ?? "",
    },
  });

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: signIn,
  });

  async function handleAuthenticate({ email, password }: SignInRequest) {
    try {
      await authenticate({ email, password });
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        setError("email", {});
        setError("password", {});

        toast.error("Credenciais inválidas");

        return;
      }

      toast.error("Erro ao entrar", {
        description: "Tente novamente mais tarde",
      });
    }
  }

  const watchedEmail = useWatch({
    control: control,
    name: "email",
  });

  const watchedPassword = useWatch({
    control: control,
    name: "password",
  });

  useEffect(() => {
    clearErrors(["email", "password"]);
  }, [clearErrors, watchedEmail, watchedPassword]);

  return (
    <>
      <Helmet title="Entrar" />
      <Card className="mx-auto max-w-sm min-w-80">
        <CardHeader>
          <CardTitle className="text-2xl">Entrar</CardTitle>
          <CardDescription>Insira suas informações para entrar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleAuthenticate)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="text"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  className={errors.email ? "border-red-500" : ""}
                  {...register("email")}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                  <Link
                    to="/forgot-password"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  className={errors.password ? "border-red-500" : ""}
                  {...register("password")}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : "Entrar"}
              </Button>
              <Button variant="outline" className="w-full" disabled>
                Entrar com Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Ainda não tem uma conta?{" "}
              <Link to="/sign-up" className="underline">
                Cadastro
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
