import { Button } from "@/components/ui/button";
import { BodyDiagnosis } from "./components/body-diagnosis";
import { BodyGoal } from "./components/body-goal";
import { BodyHeader } from "./components/body-header";
import { Plus } from "lucide-react";
import { BodyHistory } from "./components/body-history";
import { AddBodyRegistryDrawer } from "./components/add-body-registry-drawer";
import { Helmet } from "react-helmet-async";

export function Body() {
  return (
    <>
      <Helmet title="Corpo" />
      <div className="container mx-auto p-4 max-w-4xl relative">
        <BodyHeader />
        <BodyGoal />
        <BodyDiagnosis />
        <BodyHistory />
        <div className="fixed bottom-24 right-10">
          <AddBodyRegistryDrawer>
            <Button size="icon" className="rounded-full shadow-lg bg-primary">
              <Plus className="h-6 w-6" />
            </Button>
          </AddBodyRegistryDrawer>
        </div>
      </div>
    </>
  );
}
