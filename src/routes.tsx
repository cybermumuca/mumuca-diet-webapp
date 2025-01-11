import { createBrowserRouter, RouteObject } from "react-router";
import { SignIn } from "./pages/auth/sign-in";
import { SignUp } from "./pages/auth/sign-up";
import { AuthLayout } from "./pages/auth/layout";
import { AppLayout } from "./pages/home/layout";
import { Home } from "./pages/home/home";
import { Body } from "./pages/body/body";
import { Foods } from "./pages/foods/foods";
import { Settings } from "./pages/settings/settings";
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
import { EditMeal } from "./pages/meals/edit-meal/edit-meal";
import { CompleteRegistration } from "./pages/complete-registration/complete-registration";
import { Notifications } from "./pages/settings/notifications";
import { Account } from "./pages/settings/account";
import { TermsAndPrivacy } from "./pages/settings/terms-and-privacy";
import { EditMealLogPreferences } from "./pages/home/edit-meal-log-preferences";
import { ScrollToTop } from "./scroll-to-top";
import { MealLogDetails } from "./pages/home/meal-log-details";
import { EditMealLog } from "./pages/home/edit-meal-log";
import { EditMealLogFoods } from "./pages/home/edit-meal-log-foods";

// Auth routes
const authRoutes: RouteObject = {
  path: "/",
  element: <AuthLayout />,
  children: [
    { path: "/sign-in", element: <SignIn /> },
    { path: "/sign-up", element: <SignUp /> },
  ],
};

// Food routes
const foodRoutes: RouteObject[] = [
  { path: "/foods/add", element: <AddFood /> },
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
];

// Meal routes
const mealRoutes: RouteObject[] = [
  { path: "/meals/add", element: <AddMeal /> },
  {
    path: "/meals/:mealId",
    errorElement: <MealNotFound />,
    element: <MealDetails />,
  },
  {
    path: "/meals/:mealId/edit",
    errorElement: <MealNotFound />,
    element: <EditMeal />,
  },
];

// Main routes
const mainRoutes: RouteObject = {
  path: "/",
  element: (
    <>
      <ScrollToTop />
      <AppLayout />
    </>
  ),
  errorElement: <ErrorBoundary />,
  children: [
    { index: true, element: <Home /> },
    {
      element: <FoodMealTab />,
      children: [
        { path: "/foods", element: <Foods /> },
        { path: "/meals", element: <Meals /> },
      ],
    },
    { path: "/body", element: <Body /> },
    {
      path: "/settings",
      element: <Settings />,
    },
  ],
};

// Settings routes
const settingsRoutes: RouteObject[] = [
  { path: "/settings/account", element: <Account /> },
  { path: "/settings/terms-and-privacy", element: <TermsAndPrivacy /> },
  { path: "/settings/notifications", element: <Notifications /> },
];

const mealLogPreferencesRoutes: RouteObject[] = [
  { path: "/meal-log-preferences/edit", element: <EditMealLogPreferences /> },
];

const mealLogRoutes: RouteObject[] = [
  { path: "/meal-logs/:mealLogId", element: <MealLogDetails /> },
  { path: "/meal-logs/:mealLogId/edit", element: <EditMealLog /> },
  { path: "/meal-logs/:mealLogId/foods", element: <EditMealLogFoods /> },
  { path: "/meal-logs/:mealLogId/meals", element: <MealLogDetails /> },
];

export const router = createBrowserRouter([
  mainRoutes,
  ...foodRoutes,
  ...mealRoutes,
  authRoutes,
  ...settingsRoutes,
  ...mealLogPreferencesRoutes,
  ...mealLogRoutes,
  { path: "/complete-registration", element: <CompleteRegistration /> },
  { path: "*", element: <NotFound /> },
]);
