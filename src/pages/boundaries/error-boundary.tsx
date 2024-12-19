import { Button } from "@/components/ui/button";
import { env } from "@/env";
import { useRouteError, isRouteErrorResponse } from "react-router";
import { useNavigate } from "react-router";

export function ErrorBoundary() {
  const error = useRouteError() as Error;
  const navigate = useNavigate();

  const isDev = env.MODE === "development";

  console.error(error);

  const goHome = () => {
    navigate("/", {
      replace: true,
    });
  };

  const getErrorMessage = () => {
    if (isRouteErrorResponse(error)) {
      return `${error.status} - ${error.statusText}`;
    }
    
    return error.message || "Um erro inesperado ocorreu";
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <h1 className="text-3xl font-bold">Ocorreu um erro</h1>
      <p className="text-center font-semibold text-accent-foreground">
        {isDev ? getErrorMessage() : "Algo deu errado."}
      </p>
      {isDev && error.message && (
        <pre className="mt-2 max-w-[80%] overflow-auto rounded bg-slate-800 p-4 text-sm text-white">
          {error.message}
        </pre>
      )}
      <Button
        onClick={goHome}
        className="mt-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
      >
        Voltar para o início
      </Button>
    </div>
  );
}
