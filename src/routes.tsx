import { createBrowserRouter, RouteObject } from "react-router";
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
import { MealDetails } from "./pages/meals/meal-details";
import { FoodMealTab } from "./pages/shared/food-meal-tab";
import { Meals } from "./pages/meals/meals";
import { AddFood } from "./pages/foods/add-food/add-food";
import { FoodNotFound } from "./pages/foods/food-not-found";
import { AddMeal } from "./pages/meals/add-meal/add-meal";
import { MealNotFound } from "./pages/meals/meal-not-found";
import { EditFood } from "./pages/foods/edit-food/edit-food";

const authRoutes: RouteObject = {
  path: "/",
  element: <AuthLayout />,
  children: [
    {
      index: true,
      path: "/sign-in",
      element: <SignIn />,
    },
    {
      path: "/sign-up",
      element: <SignUp />,
    },
  ],
};

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
            path: "/meals",
            element: <Meals />,
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
    path: "/foods/add",
    element: <AddFood />,
  },
  {
    path: "/foods/:foodId",
    errorElement: <FoodNotFound />,
    element: <FoodDetails />,
  },
  {
    path: "/foods/:foodId/edit",
    errorElement: <FoodNotFound />,
    element: <EditFood />,
  },
  {
    path: "/meals/:mealId",
    errorElement: <MealNotFound />,
    element: <MealDetails />,
  },
  {
    path: "/meals/add",
    element: <AddMeal />,
  },
  authRoutes,
  {
    path: "*",
    element: <NotFound />,
  },
]);
