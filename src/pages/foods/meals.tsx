import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { listMeals, ListMealsResponse } from "@/api/list-meals";
import { MealCard } from "./components/meal-card";
import { Helmet } from "react-helmet-async";
import { SortOrder } from "@/types/api";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MealCardSkeleton } from "./components/meal-card-skeleton";

export function Meals() {
  const navigate = useNavigate();
  const observerTarget = useRef(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const {
    data: mealsData,
    isFetching: isFetchingMeals,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<ListMealsResponse>({
    queryKey: ["meals", sortOrder],
    queryFn: ({ pageParam = 0 }) =>
      listMeals({ page: pageParam as number, sort: sortOrder }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page.number + 1;
      return nextPage < lastPage.page.totalPages ? nextPage : undefined;
    },
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 15,
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
  });

  function openMealDetails(id: string) {
    navigate(`/meals/${id}`);
  }

  function navigateToAddMealPage() {
    navigate("/meals/add");
  }

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

  const hasNoMeals =
    !isFetchingMeals && mealsData?.pages[0]?.page.totalElements === 0;

  return (
    <>
      <Helmet title="Refeições" />
      <div className="flex flex-col gap-2 pb-20">
        <div className="flex justify-between gap-4 items-center">
          <Button onClick={navigateToAddMealPage} size="sm">
            Adicionar refeição <Plus size={16} />
          </Button>
          <Select
            value={sortOrder}
            onValueChange={(value: SortOrder) => setSortOrder(value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Selecione a ordem" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Ordem</SelectLabel>
                <SelectItem value="asc">Crescente</SelectItem>
                <SelectItem value="desc">Decrescente</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {isFetchingMeals ? (
          Array.from({ length: 5 }).map((_, index) => (
            <MealCardSkeleton key={index} />
          ))
        ) : hasNoMeals ? (
          <div className="flex items-center justify-center h-[calc(100vh-310px)]">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">
                Nenhuma refeição encontrada
              </h2>
              <p className="text-muted-foreground mb-4">
                Que tal adicionar sua primeira refeição?
              </p>
              <Button onClick={navigateToAddMealPage}>
                Adicionar sua primeira refeição
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <>
            {mealsData?.pages.map((page, pageIndex) => (
              <div key={pageIndex} className="space-y-2">
                {page.content.map((meal) => (
                  <MealCard
                    key={meal.id}
                    title={meal.title}
                    type={meal.type}
                    onClick={() => openMealDetails(meal.id)}
                  />
                ))}
              </div>
            ))}
            {isFetchingNextPage && (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <MealCardSkeleton key={index} />
                ))}
              </div>
            )}
            {!hasNextPage &&
              mealsData &&
              mealsData.pages[0].page.totalElements >= 10 &&
              mealsData.pages[0].content.length > 0 && (
                <div className="text-center text-muted-foreground text-sm mt-4">
                  Não há mais itens para carregar
                </div>
              )}
            <div ref={observerTarget} />
          </>
        )}
      </div>
    </>
  );
}
