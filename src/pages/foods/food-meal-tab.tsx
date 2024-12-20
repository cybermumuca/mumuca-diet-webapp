import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router";

export type FoodsOrMealsUnion = "foods" | "meals";

export function FoodMealTab() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState<FoodsOrMealsUnion>("foods");
  const navigate = useNavigate();

  function handleTabChange(value: string) {
    setValue(value as FoodsOrMealsUnion);
    navigate(value === "meals" ? "/meals" : "/foods");
  }

  const search = searchParams.get("search") || "";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => {
              const newSearch = e.target.value;
              setSearchParams((prevParams) => {
                const params = new URLSearchParams(prevParams);
                if (newSearch) {
                  params.set("search", newSearch);
                } else {
                  params.delete("search");
                }
                return params;
              });
            }}
          />
        </div>
        <Button size="icon" variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Tabs value={value} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="foods">Comidas</TabsTrigger>
          <TabsTrigger value="meals">Refeições</TabsTrigger>
        </TabsList>
      </Tabs>
      <Outlet />
    </div>
  );
}
