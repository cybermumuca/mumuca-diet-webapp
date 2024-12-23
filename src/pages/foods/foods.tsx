import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { listFoods, ListFoodsResponse } from "@/api/list-foods";
import { FoodCard } from "./components/food-card";
import { useCallback, useEffect, useRef, useState } from "react";
import { FoodCardSkeleton } from "./components/food-card-skeleton";
import { SortOrder } from "@/types/api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function Foods() {
  const navigate = useNavigate();
  const observerTarget = useRef(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const {
    data: foodsData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<ListFoodsResponse>({
    queryKey: ["foods", sortOrder],
    queryFn: ({ pageParam = 0 }) =>
      listFoods({ page: pageParam as number, sort: sortOrder }),
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

  function openFoodDetails(id: string) {
    navigate(`/foods/${id}`);
  }

  function navigateToAddFoodPage() {
    navigate("/foods/add");
  }

  const hasNoFoods = !isLoading && foodsData?.pages[0]?.content.length === 0;

  return (
    <div className="flex flex-col gap-2 pb-20">
      <div className="flex justify-between gap-4 items-center">
        <Button onClick={navigateToAddFoodPage} size="sm">
          Adicionar comida <Plus size={16} />
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
      {isLoading ? (
        Array.from({ length: 5 }).map((_, index) => (
          <FoodCardSkeleton key={index} />
        ))
      ) : hasNoFoods ? (
        <div className="flex items-center justify-center h-[calc(100vh-310px)]">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">
              Nenhuma comida encontrada
            </h2>
            <p className="text-muted-foreground mb-4">
              Que tal adicionar sua primeira comida?
            </p>
            <Button onClick={navigateToAddFoodPage}>
              Adicionar sua primeira comida
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <>
          {foodsData?.pages.map((page, pageIndex) => (
            <div key={pageIndex} className="space-y-2">
              {page.content.map((food) => (
                <FoodCard
                  key={food.id}
                  title={food.title}
                  brand={food.brand}
                  amount={food.portion.amount}
                  unit={food.portion.unit}
                  calories={food.nutritionalInformation.calories}
                  onClick={() => openFoodDetails(food.id)}
                />
              ))}
            </div>
          ))}
          {isFetchingNextPage && (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <FoodCardSkeleton key={index} />
              ))}
            </div>
          )}
          {!hasNextPage &&
            foodsData &&
            foodsData.pages[0].page.totalElements >= 10 &&
            foodsData.pages[0].content.length > 0 && (
              <div className="text-center text-muted-foreground text-sm mt-4">
                Não há mais itens para carregar
              </div>
            )}
          <div ref={observerTarget} />
        </>
      )}
    </div>
  );
}
