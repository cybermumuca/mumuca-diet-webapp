import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { listFoods, ListFoodsResponse } from "@/api/list-foods";
import { FoodCard } from "./components/food-card";
import { useCallback, useEffect, useRef } from "react";
import { FoodCardSkeleton } from "./components/food-card-skeleton";

export function Foods() {
  const navigate = useNavigate();
  const observerTarget = useRef(null);

  const {
    data: foodsData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<ListFoodsResponse>({
    queryKey: ["foods"],
    queryFn: ({ pageParam }) => listFoods({ page: pageParam as number }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page.number + 1;
      return nextPage < lastPage.page.totalPages ? nextPage : undefined;
    },
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 1,
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

  return (
    <div className="flex flex-col gap-2 pb-20">
      {isLoading ? (
        Array.from({ length: 5 }).map((_, index) => (
          <FoodCardSkeleton key={index} />
        ))
      ) : (
        <>
          {foodsData?.pages.map((page, pageIndex) => (
            <div key={pageIndex} className="space-y-2">
              {page.content.map((food) => (
                <FoodCard
                  key={food.id}
                  id={food.id}
                  title={food.title}
                  brand={food.brand ?? undefined}
                  calories={food.nutritionalInformation.calories}
                  onClick={openFoodDetails}
                />
              ))}
            </div>
          ))}
          {isFetchingNextPage && (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <FoodCardSkeleton key={index} />
              ))}
            </div>
          )}
          <div ref={observerTarget} />
        </>
      )}
    </div>
  );
}
