import { InfoPopover } from "@/components/info-popover";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { BellIcon, ChevronLeftIcon, MailIcon } from "lucide-react";
import { useNavigate } from "react-router";

export function Notifications() {
  const navigate = useNavigate();

  function handleBack() {
    navigate("/settings");
  }

  const notificationsSections = [
    {
      title: "Notificações por e-mail",
      description: "Receba notificações por e-mail.",
      icon: MailIcon,
    },
    {
      title: "Notificações por push",
      description: "Receba notificações por push.",
      icon: BellIcon,
    },
  ];

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
          <h1 className="text-2xl font-bold text-nowrap">Notificações</h1>
        </div>
        <InfoPopover
          content={
            <>
              <p>
                Em breve você poderá receber notificações do app.
              </p>
              <br />
              <p>
                Esta funcionalidade está em desenvolvimento e será
                disponibilizada em uma atualização futura.
              </p>
            </>
          }
        />
      </div>
      <Separator className="my-4 bg-muted-foreground" />

      <div className="grid gap-4">
        {notificationsSections.map((section, index) => (
          <Card
            key={index}
            className="cursor-pointer hover:bg-accent transition-colors"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center">
                <section.icon className="w-6 h-6 mr-4" />
                <div>
                  <CardTitle className="text-base">{section.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {section.description}
                  </CardDescription>
                </div>
              </div>
              <Switch checked={false} onCheckedChange={() => {}} />
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
