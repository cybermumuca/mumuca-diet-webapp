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
import { isAxiosError } from "axios";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const signUpSchema = z.object({
  firstName: z.string().min(1, "O Nome é obrigatório"),
  lastName: z.string().min(1, "O Sobrenome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

type SignUpSchema = z.infer<typeof signUpSchema>;

export function SignUp() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
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

      if (isAxiosError(error) && error.response?.status === 409) {
        setError("email", {
          message: "Email já cadastrado",
        });

        toast.error("Erro ao criar conta", {
          description: "Email já cadastrado",
        });

        return;
      }

      if (isAxiosError(error) && error.response?.status === 400) {
        const details = error.response.data.details;

        Object.entries(details).forEach(([field, message]) => {
          setError(field as keyof SignUpSchema, {
            message: message as string,
          });
        });

        const errorMessages = Object.values(details).join("\n");

        toast.error("Erro de validação", {
          description: errorMessages,
        });
      }

      toast.error("Erro ao criar conta");
    }
  }

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const errorMessages = Object.values(errors)
        .map((error) => error.message)
        .join("<br />");

      toast.error("Erro de validação", {
        description: (
          <span dangerouslySetInnerHTML={{ __html: errorMessages }} />
        ),
        closeButton: true,
        duration: 10000,
      });
    }
  }, [errors]);

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
                    className={errors.firstName ? "border-red-500" : ""}
                    {...register("firstName")}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Sobrenome</Label>
                  <Input
                    id="last-name"
                    type="text"
                    autoCorrect="false"
                    className={errors.lastName ? "border-red-500" : ""}
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
                  className={errors.email ? "border-red-500" : ""}
                  {...register("email")}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  className={errors.password ? "border-red-500" : ""}
                  {...register("password")}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Cadastrando...
                  </>
                ) : (
                  "Cadastrar"
                )}
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
