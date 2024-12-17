import "./index.css";

import { Helmet, HelmetProvider } from "react-helmet-async";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ThemeProvider } from "./components/theme-provider";
import { queryClient } from "./lib/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

export function App() {
  return (
    <HelmetProvider>
      <Helmet titleTemplate="%s | mumuca.diet" />
      <ThemeProvider defaultTheme="light" storageKey="mumuca-diet-theme">
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <Toaster richColors />
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
