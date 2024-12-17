import { signIn } from "@/api/sign-in";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type SignInSchema = z.infer<typeof signInSchema>;

export function SignIn() {
  const [searchParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: searchParams.get("hint") ?? "",
    },
  });

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: signIn,
  });

  async function handleAuthenticate({ email, password }: SignInSchema) {
    try {
      await authenticate({ email, password });
    } catch (error) {
      console.log(error);
      toast.error("Credenciais inválidas");
    }
  }

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
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
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
                  {...register("password")}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                Entrar
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
