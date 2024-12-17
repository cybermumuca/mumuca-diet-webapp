import { ThemeToggle } from "@/components/theme-toggle";
import { Outlet } from "react-router";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col antialiased ">
      <div className="w-full p-4 absolute">
        <ThemeToggle />
      </div>

      <div className="flex flex-1 items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
}
