"use client";
import React from "react";
import { ThemeProvider } from "./theme-provider";
import { Provider } from "react-redux";
import { makeStore } from "@/lib/redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  const store = makeStore();

  const client = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 7,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 1,
      },
    },
  });

  return (
    <>
      <ThemeProvider defaultTheme="system" storageKey="invoicepay-theme">
        <QueryClientProvider client={client}>
          <Provider store={store}>
            <Toaster richColors position="top-right" />
            {children}
          </Provider>
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
}
