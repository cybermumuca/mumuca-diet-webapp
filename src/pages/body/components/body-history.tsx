import { listBodies, ListBodiesResponse } from "@/api/list-bodies";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { Calendar, Plus, Ruler, Trash2, Weight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AddBodyRegistryDrawer } from "./add-body-registry-drawer";
import { deleteBody } from "@/api/delete-body";
import { toast } from "sonner";
import { queryClient } from "@/lib/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function BodyHistory() {
  const observerTarget = useRef(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const {
    data: bodiesData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<ListBodiesResponse>({
    queryKey: ["bodies"],
    queryFn: ({ pageParam = 0 }) => listBodies({ page: pageParam as number }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page.number + 1;
      return nextPage < lastPage.page.totalPages ? nextPage : undefined;
    },
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 30,
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
  });

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const element = observerTarget.current;
    const option = { threshold: 0 };

    const observer = new IntersectionObserver(handleObserver, option);
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [handleObserver]);

  const hasNoBodies = !isLoading && bodiesData?.pages[0]?.content.length === 0;

  const { mutateAsync: removeBodyRegistry } = useMutation({
    mutationFn: deleteBody,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["bodies"] });
      queryClient.refetchQueries({ queryKey: ["goal"] });
      queryClient.refetchQueries({ queryKey: ["latestBody"] });
      queryClient.refetchQueries({ queryKey: ["diagnosis"] });
    },
  });

  async function handleRemoveBodyRegistry(bodyId: string) {
    try {
      await removeBodyRegistry(bodyId);
      toast.success("Registro removido com sucesso.");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao remover registro. Tente novamente mais tarde.");
    }
  }

  return (
    <section id="history" className="mt-8 mb-8">
      <div className="flex items-center justify-between mt-4 mb-2">
        <h2 className="font-semibold text-lg">Histórico</h2>
      </div>
      {isLoading ? (
        <div className="space-y-2 mb-8">
          {[...Array(2)].map((_, pageIndex) => (
            <div key={pageIndex} className="space-y-2">
              {[...Array(1)].map((_, itemIndex) => (
                <div
                  key={itemIndex}
                  className="rounded-lg p-6 w-full mx-auto border"
                >
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="w-5 h-5 rounded-full" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex items-center space-x-3">
                      <Skeleton className="w-5 h-5 rounded-full" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex items-center space-x-3">
                      <Skeleton className="w-5 h-5 rounded-full" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : hasNoBodies ? (
        <div className="flex items-center justify-center h-[calc(100vh-310px)]">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">
              Nenhuma registro encontrado
            </h2>
            <p className="text-muted-foreground mb-4">
              Que tal registrar suas medidas?
            </p>
            <AddBodyRegistryDrawer>
              <Button>
                Registrar medidas
                <Plus className="h-4 w-4" />
              </Button>
            </AddBodyRegistryDrawer>
          </div>
        </div>
      ) : (
        <>
          {bodiesData?.pages.map((page, pageIndex) => (
            <div key={pageIndex} className="space-y-2">
              {page.content.map((body) => (
                <div className="rounded-lg p-6 w-full mx-auto border">
                  <div className="grid grid-cols-[1fr,auto] gap-4">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Weight className="w-5 h-5" />
                        <p className="text-sm">
                          <span className="font-medium">
                            {body.weight.toFixed(2)} kg
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Ruler className="w-5 h-5" />
                        <p className="text-sm">
                          <span className="font-medium">
                            {body.height.toFixed(2)} m
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5" />
                        <p className="text-sm">
                          <span className="font-medium">
                            {format(parseISO(body.date), "dd/MM/yyyy")}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start justify-end">
                      <AlertDialog
                        open={isAlertOpen}
                        onOpenChange={setIsAlertOpen}
                      >
                        <AlertDialogTrigger asChild>
                          <Trash2 className="w-4 h-4 translate-y-1 text-red-600 dark:text-red-400" />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Você tem certeza?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              O Registro será excluído permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRemoveBodyRegistry(body.id)}
                            >
                              Excluir registro
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
          {isFetchingNextPage && (
            <div className="space-y-2">
              {[...Array(2)].map((_, pageIndex) => (
                <div key={pageIndex} className="space-y-2">
                  {[...Array(2)].map((_, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="rounded-lg p-6 w-full mx-auto border"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Skeleton className="w-5 h-5 rounded-full" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                        <div className="flex items-center space-x-3">
                          <Skeleton className="w-5 h-5 rounded-full" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                        <div className="flex items-center space-x-3">
                          <Skeleton className="w-5 h-5 rounded-full" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          {!hasNextPage &&
            bodiesData &&
            bodiesData.pages[0].page.totalElements >= 10 &&
            bodiesData.pages[0].content.length > 0 && (
              <div className="text-center text-muted-foreground text-sm mt-4">
                Não há mais itens para carregar
              </div>
            )}
          <div ref={observerTarget} />
        </>
      )}
    </section>
  );
}
