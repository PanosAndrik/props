"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Toast = { id: number; message: string };

const ToastContext = createContext<(message: string) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 2800);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        className="pointer-events-none fixed bottom-20 left-0 right-0 z-[60] flex flex-col items-center gap-2 px-4 sm:bottom-6"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg"
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/** Bridge for non-hook callers (e.g. after copy) */
let globalToast: ((message: string) => void) | null = null;

export function registerGlobalToast(fn: (message: string) => void) {
  globalToast = fn;
}

export function showToast(message: string) {
  globalToast?.(message);
}

export function ToastRegistrar() {
  const toast = useToast();
  useEffect(() => {
    registerGlobalToast(toast);
    return () => registerGlobalToast(() => {});
  }, [toast]);
  return null;
}
