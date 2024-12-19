import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export function NotFound() {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/", {
      replace: true,
    });
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <h1 className="text-3xl font-bold text-nowrap">Página não encontrada</h1>
      <p className="text-center font-semibold text-accent-foreground">
        Não encontramos o que você está procurando.
      </p>
      <Button
        onClick={goHome}
        className="mt-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
      >
        Voltar para o início
      </Button>
    </div>
  );
}
