"use client";

import { ToastProvider, ToastRegistrar } from "@/components/toast-provider";
import { CompareBar } from "@/components/compare-bar";

export function SiteProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ToastRegistrar />
      {children}
      <CompareBar />
    </ToastProvider>
  );
}
