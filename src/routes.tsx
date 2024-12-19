import { createBrowserRouter } from "react-router";
import { SignIn } from "./pages/auth/sign-in";
import { SignUp } from "./pages/auth/sign-up";
import { AuthLayout } from "./pages/auth/layout";
import { AppLayout } from "./pages/home/layout";
import { Home } from "./pages/home/home";
import { Body } from "./pages/body/body";
import { Foods } from "./pages/foods/foods";
import { Profile } from "./pages/profile/profile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/foods",
        element: <Foods />,
      },
      {
        path: "/body",
        element: <Body />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
]);
