import { ProfilePicture } from "@/components/profile-picture";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { User, Paintbrush, Bell, FileText, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { useTheme } from "@/components/theme-provider";
import { useState } from "react";

export function Settings() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(theme === "dark");

  function handleThemeToggle() {
    setIsDarkMode(!isDarkMode);
    setTheme(isDarkMode ? "light" : "dark");
  }

  function handleLogout() {
    navigate("/sign-in", {
      replace: true,
    });
  }

  const settingsSections = [
    {
      title: "Conta",
      description: "Configurações de conta, perfil e segurança.",
      icon: User,
      route: "/settings/account",
    },
    // {
    //   title: "Aparência",
    //   description: "Configurações de Tema",
    //   icon: Paintbrush,
    //   route: "/settings/theme",
    // },
    {
      title: "Notificações",
      description: "Configurações de notificações",
      icon: Bell,
      route: "/settings/notifications",
    },
    // {
    //   title: "Idioma",
    //   description: "Configurações de idioma",
    //   icon: Globe,
    //   route: "/settings/languages",
    // },
    {
      title: "Termos de uso e privacidade",
      description: "Leia nossos termos de uso e política de privacidade",
      icon: FileText,
      route: "/settings/terms-and-privacy",
    },
  ];

  return (
    <div className="container mx-auto max-w-2xl p-4 space-y-6 mb-10">
      <div className="flex flex-col justify-center items-center">
        <ProfilePicture size="xl" />
        <h1 className="text-xl font-bold mt-4">Samuel Laurindo de Lima</h1>
      </div>

      <div className="grid gap-4">
        {settingsSections.map((section, index) => (
          <Card
            key={index}
            className="cursor-pointer hover:bg-accent transition-colors"
            onClick={() => navigate(section.route)}
          >
            <CardHeader className="flex flex-row items-center space-y-0">
              <section.icon className="w-6 h-6 mr-4" />
              <div>
                <CardTitle className="text-lg">{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center">
              <Paintbrush className="w-6 h-6 mr-4" />
              <div>
                <CardTitle className="text-lg">Modo Escuro</CardTitle>
                <CardDescription>
                  Alternar entre temas claro e escuro
                </CardDescription>
              </div>
            </div>
            <Switch checked={isDarkMode} onCheckedChange={handleThemeToggle} />
          </CardHeader>
        </Card>
        <Button variant="destructive" className="w-full" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </div>
    </div>
  );
}
