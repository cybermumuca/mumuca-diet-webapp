import { createBrowserRouter } from "react-router";
import { SignIn } from "./pages/auth/sign-in";
import { SignUp } from "./pages/auth/sign-up";
import { AuthLayout } from "./pages/auth/layout";
import { AppLayout } from "./pages/home/layout";
import { Home } from "./pages/home/home";
import { Body } from "./pages/body/body";
import { Foods } from "./pages/foods/foods";
import { Profile } from "./pages/profile/profile";
import { NotFound } from "./pages/boundaries/not-found";
import { ErrorBoundary } from "./pages/boundaries/error-boundary";
import { FoodDetails } from "./pages/foods/food-details";
import { MealDetails } from "./pages/foods/meal-details";
import { FoodMealTab } from "./pages/foods/food-meal-tab";
import { Meals } from "./pages/foods/meals";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        element: <FoodMealTab />,
        children: [
          {
            path: "/foods",
            element: <Foods />,
          },
          {
            path: "/foods/:foodId",
            element: <FoodDetails />,
          },
          {
            path: "meals",
            element: <Meals />,
          },
          {
            path: "/meals/:mealId",
            element: <MealDetails />,
          },
        ],
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
  {
    path: "*",
    element: <NotFound />,
  },
]);
