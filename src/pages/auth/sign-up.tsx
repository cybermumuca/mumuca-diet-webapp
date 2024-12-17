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
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signUp } from "@/api/sign-up";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

const signUpSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type SignUpSchema = z.infer<typeof signUpSchema>;

// TODO: display validation error message to user
export function SignUp() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const { mutateAsync: signUpMutation } = useMutation({
    mutationFn: signUp,
  });

  async function handleSignUp({
    firstName,
    lastName,
    email,
    password,
  }: SignUpSchema) {
    try {
      await signUpMutation({ firstName, lastName, email, password });

      toast.success("Conta criada com sucesso", {
        description: "",
        action: {
          label: "Login",
          onClick: () => {
            navigate(`/sign-in?hint=${email}`);
          },
        },
      });
    } catch (error) {
      console.log(error);
      toast.error("Erro ao criar conta");
    }
  }

  return (
    <>
      <Helmet title="Cadastro" />
      <Card className="mx-auto max-w-sm max-[400px]:w-[340px]">
        <CardHeader>
          <CardTitle className="text-xl">Cadastro</CardTitle>
          <CardDescription>
            Insira suas informações para criar uma conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleSignUp)}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">Nome</Label>
                  <Input
                    id="first-name"
                    type="text"
                    autoCorrect="false"
                    {...register("firstName")}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Sobrenome</Label>
                  <Input
                    id="last-name"
                    type="text"
                    autoCorrect="false"
                    {...register("lastName")}
                  />
                </div>
              </div>
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
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                Criar conta
              </Button>
              <Button variant="outline" className="w-full" disabled>
                Entrar com Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Já possui uma conta?{" "}
              <Link to="/sign-in" className="underline">
                Entrar
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
