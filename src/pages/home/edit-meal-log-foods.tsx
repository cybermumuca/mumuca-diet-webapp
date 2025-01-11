import { listFoods, ListFoodsResponse } from "@/api/list-foods";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router";
import { z } from "zod";
import { FoodCardSkeleton } from "../foods/components/food-card-skeleton";
import { FoodCard } from "../foods/components/food-card";
import {
  addFoodsToMealLog,
  AddFoodsToMealLogBody,
} from "@/api/add-foods-to-meal-log";
import { MealLogNotFoundError } from "./errors/meal-log-not-found-error";
import { queryClient } from "@/lib/react-query";
import {
  removeFoodsFromMealLog,
  RemoveFoodsFromMealLogBody,
} from "@/api/remove-foods-from-meal-log";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { getMealLogFoods } from "@/api/get-meal-log-foods";

const editMealLogFoodsSchema = z.object({
  foodIds: z
    .array(z.string().uuid())
    .refine(
      (arr) => arr.every((id) => z.string().uuid().safeParse(id).success),
      {
        message: "Todos os itens devem ser válidos",
      }
    ),
});

type EditMealLogFoodsSchema = z.infer<typeof editMealLogFoodsSchema>;

export function EditMealLogFoods() {
  const location = useLocation();
  const backUrl: string = location.state?.backUrl ?? "/";
  const navigate = useNavigate();

  const { mealLogId } = useParams<{ mealLogId: string }>();

  if (!mealLogId || !z.string().uuid().safeParse(mealLogId).success) {
    throw new MealLogNotFoundError();
  }

  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [defaultSynced, setDefaultSynced] = useState(false);
  const observerTarget = useRef(null);

  const {
    setValue,
    getValues,
    formState: { defaultValues, isSubmitting },
    handleSubmit,
  } = useForm<EditMealLogFoodsSchema>({
    resolver: zodResolver(editMealLogFoodsSchema),
  });

  const { data: mealLogFoods, isLoading: isMealLogFoodsLoading } = useQuery({
    queryKey: ["mealLogFoods", mealLogId],
    queryFn: () => getMealLogFoods(mealLogId),
  });

  const {
    data: foodsData,
    isSuccess,
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

  function toggleSelection(foodId: string) {
    setSelectedFoods((prev) =>
      prev.includes(foodId)
        ? prev.filter((id) => id !== foodId)
        : [...prev, foodId]
    );

    console.log(selectedFoods);
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

  useEffect(() => {
    setValue("foodIds", selectedFoods);
  }, [selectedFoods, setValue]);

  useEffect(() => {
    if (isSuccess && !defaultSynced) {
      const defaultFoodIds = defaultValues?.foodIds ?? [];
      setSelectedFoods(defaultFoodIds.filter(Boolean) as string[]);
      setDefaultSynced(true);
    }
  }, [isSuccess, defaultSynced, getValues, defaultValues?.foodIds]);

  useEffect(() => {
    if (mealLogFoods) {
      const foodIds = mealLogFoods.map((food) => food.id);
      setSelectedFoods(foodIds);
      setValue("foodIds", foodIds);
      console.log(foodIds);
    }
  }, [mealLogFoods, setValue]);

  function handleBack() {
    navigate(backUrl);
  }

  const { mutateAsync: addFoods } = useMutation({
    mutationFn: (data: AddFoodsToMealLogBody) =>
      addFoodsToMealLog(mealLogId, data),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["meal-logs"], active: true });
      queryClient.refetchQueries({ queryKey: ["meal-log", mealLogId] });
    },
  });

  const { mutateAsync: removeFoods } = useMutation({
    mutationFn: (data: RemoveFoodsFromMealLogBody) =>
      removeFoodsFromMealLog(mealLogId, data),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["meal-logs"], active: true });
      queryClient.refetchQueries({ queryKey: ["meal-log", mealLogId] });
    },
  });

  async function handleEditMealLogFoods(data: EditMealLogFoodsSchema) {
    console.log(data);

    try {
      const foodsToAdd = data.foodIds.filter((id) =>
        mealLogFoods ? !mealLogFoods?.map((food) => food.id).includes(id) : true
      );

      const foodsToRemove = mealLogFoods
        ? mealLogFoods
            ?.map((food) => food.id)
            .filter((id: string) => !data.foodIds.includes(id))
        : [];

      if (foodsToAdd.length) {
        await addFoods({ foodIds: foodsToAdd });
      }

      if (foodsToRemove.length) {
        await removeFoods({ foodIds: foodsToRemove });
      }

      toast.success("Registro de refeição editada com sucesso");

      navigate(backUrl);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao editar registro de refeição", {
        description: "Tente novamente mais tarde.",
      });
    }
  }

  if (isMealLogFoodsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
      </div>
    );
  }

  const hasNoFoods =
    !isFetchingFoods && foodsData?.pages[0]?.page.totalElements === 0;

  return (
    <div className="container mx-auto px-8 py-6 max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            className="hover:bg-transparent"
            onClick={handleBack}
            variant="ghost"
            size="icon"
          >
            <ChevronLeftIcon className="translate-y-[2px]" />
          </Button>
          <h1 className="text-xl font-bold text-nowrap">
            Editar Comidas Do Registro
          </h1>
        </div>
      </div>
      <Separator className="my-4 bg-muted-foreground" />
      <form onSubmit={handleSubmit(handleEditMealLogFoods, console.log)}>
        <div className="space-y-4">
          <div>
            <Label className="block mb-4">Comidas disponiveis</Label>
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

        <div className="mt-4">
          <Button
            type="submit"
            className="w-full font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Salvar"}
          </Button>
        </div>
      </form>
    </div>
  );
}
