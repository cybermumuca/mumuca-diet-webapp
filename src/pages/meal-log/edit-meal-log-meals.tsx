import { useLocation, useNavigate, useParams } from "react-router";
import { z } from "zod";
import { MealLogNotFoundError } from "../home/errors/meal-log-not-found-error";
import { useCallback, useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getMealLogMeals } from "@/api/get-meal-log-meals";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { listMeals, ListMealsResponse } from "@/api/list-meals";
import {
  removeMealsFromMealLog,
  RemoveMealsFromMealLogBody,
} from "@/api/remove-meals-from-meal-log";
import {
  addMealsToMealLog,
  AddMealsToMealLogBody,
} from "@/api/add-meals-to-meal-log";
import { queryClient } from "@/lib/react-query";
import { toast } from "sonner";
import { ChevronLeftIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MealCardSkeleton } from "../meals/components/meal-card-skeleton";
import { MealCard } from "../meals/components/meal-card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Helmet } from "react-helmet-async";

const editMealLogMealsSchema = z.object({
  mealIds: z
    .array(z.string().uuid())
    .refine(
      (arr) => arr.every((id) => z.string().uuid().safeParse(id).success),
      {
        message: "Todos os itens devem ser válidos",
      }
    ),
});

type EditMealLogMealsSchema = z.infer<typeof editMealLogMealsSchema>;

export function EditMealLogMeals() {
  const location = useLocation();
  const backUrl: string = location.state?.backUrl ?? "/";
  const navigate = useNavigate();

  const { mealLogId } = useParams<{ mealLogId: string }>();

  if (!mealLogId || !z.string().uuid().safeParse(mealLogId).success) {
    throw new MealLogNotFoundError();
  }

  const [selectedMeals, setSelectedMeals] = useState<string[]>([]);
  const [defaultSynced, setDefaultSynced] = useState(false);
  const observerTarget = useRef(null);

  const {
    setValue,
    getValues,
    formState: { defaultValues, isSubmitting },
    handleSubmit,
  } = useForm<EditMealLogMealsSchema>({
    resolver: zodResolver(editMealLogMealsSchema),
  });

  const { data: mealLogMeals, isLoading: isMealLogMealsLoading } = useQuery({
    queryKey: ["mealLogMeals", mealLogId],
    queryFn: () => getMealLogMeals(mealLogId),
  });

  const {
    data: mealsData,
    isSuccess,
    isFetching: isFetchingMeals,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<ListMealsResponse>({
    queryKey: ["meals", "size-50"],
    queryFn: ({ pageParam = 0 }) =>
      listMeals({ page: pageParam as number, size: 50 }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page.number + 1;
      return nextPage < lastPage.page.totalPages ? nextPage : undefined;
    },
    refetchOnWindowFocus: true,
  });

  function toggleSelection(mealId: string) {
    setSelectedMeals((prev) =>
      prev.includes(mealId)
        ? prev.filter((id) => id !== mealId)
        : [...prev, mealId]
    );
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
    setValue("mealIds", selectedMeals);
  }, [selectedMeals, setValue]);

  useEffect(() => {
    if (isSuccess && !defaultSynced) {
      const defaultMealIds = defaultValues?.mealIds ?? [];
      setSelectedMeals(defaultMealIds.filter(Boolean) as string[]);
      setDefaultSynced(true);
    }
  }, [isSuccess, defaultSynced, getValues, defaultValues?.mealIds]);

  useEffect(() => {
    if (mealLogMeals) {
      const mealIds = mealLogMeals.map((meal) => meal.id);
      setSelectedMeals(mealIds);
      setValue("mealIds", mealIds);
    }
  }, [mealLogMeals, setValue]);

  function handleBack() {
    navigate(backUrl);
  }

  const { mutateAsync: addMeals } = useMutation({
    mutationFn: (data: AddMealsToMealLogBody) =>
      addMealsToMealLog(mealLogId, data),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["meal-logs"], active: true });
      queryClient.refetchQueries({ queryKey: ["meal-log", mealLogId] });
      queryClient.refetchQueries({ queryKey: ["mealLogMeals", mealLogId] });
    },
  });

  const { mutateAsync: removeMeals } = useMutation({
    mutationFn: (data: RemoveMealsFromMealLogBody) =>
      removeMealsFromMealLog(mealLogId, data),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["meal-logs"], active: true });
      queryClient.refetchQueries({ queryKey: ["meal-log", mealLogId] });
      queryClient.refetchQueries({ queryKey: ["mealLogMeals", mealLogId] });
    },
  });

  async function handleEditMealLogMeals(data: EditMealLogMealsSchema) {
    try {
      const mealsToAdd = data.mealIds.filter((id) =>
        mealLogMeals ? !mealLogMeals?.map((meal) => meal.id).includes(id) : true
      );

      const mealsToRemove = mealLogMeals
        ? mealLogMeals
            ?.map((meal) => meal.id)
            .filter((id: string) => !data.mealIds.includes(id))
        : [];

      if (mealsToAdd.length) {
        await addMeals({ mealIds: mealsToAdd });
      }

      if (mealsToRemove.length) {
        await removeMeals({ mealIds: mealsToRemove });
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

  if (isMealLogMealsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
      </div>
    );
  }

  const hasNoMeals =
    !isFetchingMeals && mealsData?.pages[0]?.page.totalElements === 0;

  return (
    <>
      <Helmet title="Editar Refeições Associadas ao Registro de Refeição" />
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
              Editar Refeições Do Registro
            </h1>
          </div>
        </div>
        <Separator className="my-4 bg-muted-foreground" />
        <form onSubmit={handleSubmit(handleEditMealLogMeals)}>
          <div className="space-y-4">
            <div>
              <Label className="block mb-4">Refeições disponiveis</Label>
              <div className="max-h-[calc(90vh-195px)] overflow-y-scroll">
                {isFetchingMeals ? (
                  Array.from({ length: 10 }).map((_, index) => (
                    <MealCardSkeleton key={index} />
                  ))
                ) : hasNoMeals ? (
                  <div className="flex items-center justify-center h-[calc(100vh-310px)]">
                    <div className="text-center">
                      <h2 className="text-2xl font-semibold mb-2">
                        Nenhuma refeição encontrada
                      </h2>
                      <p className="text-muted-foreground mb-4 text-sm">
                        Adicione uma nova refeição e ela aparecerá aqui.
                      </p>
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
                            onClick={() => toggleSelection(meal.id)}
                            className={`cursor-pointer ${
                              selectedMeals.includes(meal.id)
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
    </>
  );
}
