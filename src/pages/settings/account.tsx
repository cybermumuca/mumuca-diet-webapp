import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/api/get-profile";
import { ChevronLeftIcon, Loader2, Menu, Pencil, Trash } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
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
import { useNavigate } from "react-router";
import { ProfilePicture } from "@/components/profile-picture";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { getActivityLevelLabel } from "@/utils/get-activity-level-label";

export function Account() {
  const navigate = useNavigate();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const {
    data: profile,
    isLoading: isProfileLoading,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  if (isProfileLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
      </div>
    );
  }

  if (!profile || error) {
    throw new Error("Profile not found");
  }

  function handleBack() {
    navigate("/settings");
  }

  function handleEdit() {
    navigate("/settings/account/edit");
  }

  function handleDelete() {
    console.log("Implement delete account");
  }

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
          <h1 className="text-2xl font-bold text-nowrap">Visualizar Perfil</h1>
        </div>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Opções</DrawerTitle>
              <DrawerDescription>
                Escolha uma ação para sua conta.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 space-y-4">
              <Button
                onClick={handleEdit}
                className="w-full justify-start"
                variant="outline"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Editar Informações
              </Button>
              <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    className="w-full justify-start"
                    variant="destructive"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Excluir Conta
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      A sua conta será excluída permanentemente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Excluir conta
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
      <Separator className="my-4 bg-muted-foreground" />
      <div className="flex flex-col mt-8 justify-center items-center">
        <ProfilePicture size="xl" />
        {isProfileLoading && <Skeleton className="mt-4 h-8 w-52" />}
        {profile && !isProfileLoading && (
          <h1 className="text-xl font-bold mt-4">
            {profile.firstName.concat(" ", profile.lastName)}
          </h1>
        )}
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold">Gênero</h2>
        <p>{profile.gender === "MALE" ? "Masculino" : "Feminino"}</p>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Idade</h2>
        <p>{profile.age} anos</p>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Nível de Atividade</h2>
        <p>{getActivityLevelLabel(profile.activityLevel)}</p>
      </div>
    </div>
  );
}
