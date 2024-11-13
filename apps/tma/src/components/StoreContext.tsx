// apps/tma/src/components/StoreContext.tsx

import { createContext, useContext } from "react";
import { Store, createStore } from "@/store/store";
import { useStore } from "zustand";

export type StoreContextType = ReturnType<typeof createStore>;

export const StoreContext = createContext<StoreContextType | null>(null);

export function useCommonStore<T>(selector: (store: Store) => T): T {
  const store = useContext<StoreContextType | null>(StoreContext)!;
  if (!store) {
    throw new Error("Missing StoreProvider");
  }
  return useStore(store, selector);
}
