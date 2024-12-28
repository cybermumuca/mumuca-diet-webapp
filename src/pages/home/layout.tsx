import { api } from "@/lib/axios";
import { Home, Utensils, Activity } from "lucide-react";
import { isAxiosError } from "axios";
import { useLayoutEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { NavItem } from "@/components/nav-item";
import { ProfilePicture } from "@/components/profile-picture";

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isFoodPageActive =
    location.pathname.startsWith("/foods") ||
    location.pathname.startsWith("/meals");

  useLayoutEffect(() => {
    const interceptorId = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (isAxiosError(error)) {
          const status = error.response?.status;

          if (status === 401) {
            navigate("/sign-in", {
              replace: true,
            });
          }

          if (
            status === 422 &&
            error.response?.data?.errorMessage === "User Not Registered Yet."
          ) {
            navigate("/complete-registration", {
              replace: true,
            });
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptorId);
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col antialiased">
      <div className="flex flex-1 flex-col gap-4 p-8 pt-6">
        <Outlet />
      </div>
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t">
        <div className="flex justify-around items-center h-16">
          <NavItem to="/" icon={<Home className="w-6 h-6" />} />
          <NavItem
            to="/foods"
            icon={<Utensils className="w-6 h-6" />}
            isActive={isFoodPageActive}
          />
          <NavItem to="/body" icon={<Activity className="w-6 h-6" />} />
          <NavItem to="/profile" icon={<ProfilePicture size="sm" />} />
        </div>
      </nav>
    </div>
  );
}
