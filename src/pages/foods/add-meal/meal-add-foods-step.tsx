import { listFoods, ListFoodsResponse } from "@/api/list-foods";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { CreateMealSchema } from "./add-meal";
import { Label } from "@/components/ui/label";
import { FoodCard } from "../components/food-card";
import { FoodCardSkeleton } from "../components/food-card-skeleton";

export function MealAddFoodsStep() {
  const { setValue } = useFormContext<CreateMealSchema>();
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const observerTarget = useRef(null);

  function toggleSelection(foodId: string) {
    if (selectedFoods.includes(foodId)) {
      setSelectedFoods((prev) => prev.filter((id) => id !== foodId));
    } else {
      setSelectedFoods((prev) => [...prev, foodId]);
    }
  }

  useEffect(() => {
    setValue("foodIds", selectedFoods);
  }, [selectedFoods, setValue]);

  const {
    data: foodsData,
    isFetching: isFetchingFoods,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<ListFoodsResponse>({
    queryKey: ["foods", "size-50"],
    queryFn: ({ pageParam = 0 }) =>
      listFoods({ page: pageParam as number, size: 50 }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page.number + 1;
      return nextPage < lastPage.page.totalPages ? nextPage : undefined;
    },
    refetchOnWindowFocus: true,
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

  const hasNoFoods =
    !isFetchingFoods && foodsData?.pages[0]?.page.totalElements === 0;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Adicionar alimentos</h2>
      <div>
        <Label className="block mb-4">Alimentos disponiveis</Label>
        {/* <p className="text-sm text-muted-foreground">
          Toque para selecionar alimentos para esta refeição. Você também pode
          pular essa etapa e fazer isso mais tarde.
        </p> */}

        <div className="max-h-[calc(90vh-195px)] overflow-y-scroll">
          {isFetchingFoods ? (
            Array.from({ length: 10 }).map((_, index) => (
              <FoodCardSkeleton key={index} />
            ))
          ) : hasNoFoods ? (
            <div className="flex items-center justify-center h-[calc(100vh-310px)]">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2">
                  Nenhuma comida encontrada
                </h2>
                <p className="text-muted-foreground mb-4 text-sm">
                  Adicione uma nova comida e ela aparecerá aqui.
                </p>
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
                      onClick={() => toggleSelection(food.id)}
                      className={`cursor-pointer ${
                        selectedFoods.includes(food.id)
                          ? "border-2 border-primary"
                          : "border"
                      }`}
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
      </div>
    </div>
  );
}
