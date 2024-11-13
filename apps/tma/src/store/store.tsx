// apps/tma/src/store/store.tsx

import { create } from "zustand";
import { ConfigSlice, MineType, UserGameSlice, AppSlice } from "./types";
import { createGameSlice, getHireWorkerCount } from "./gameSlice";
import { createConfigSlice } from "./configSlice";
import { immer } from "zustand/middleware/immer";
import { createAppSlice } from "./appSlice";
import { CloudStorage } from "@tma.js/sdk";
import { persist } from "zustand/middleware";
import { useCommonStore } from "@/components/StoreContext";

export interface Store extends ConfigSlice, UserGameSlice, AppSlice {}

const localStorageKeys = ["onMusic", "onSound"];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createStore = (_: CloudStorage) => {
  const store = create<Store>()(
    persist(
      immer((set, get, store) => ({
        ...createConfigSlice(set, get, store),
        ...createGameSlice(set, get, store),
        ...createAppSlice(set, get, store),
      })),
      {
        name: "commonStore",
        partialize: (state) =>
          Object.fromEntries(
            Object.entries(state).filter(([key]) =>
              localStorageKeys.includes(key)
            )
          ),
      }
    )
  );

  return store;
};

export const useImpossibleUpdateStore = (mineId: MineType["id"]) => {
  const coin = useCommonStore((state) => state.coin);
  const mCoin = useCommonStore((state) => state.mCoin);
  const mines = useCommonStore((state) => state.mines);
  const mine = mines[mineId];
  const availableMines = useCommonStore((state) => state.availableMines);
  const resource = availableMines.find((r) => r.resource.id === mineId);

  if (mine === undefined || resource === undefined) {
    return true;
  }

  return (
    !resource.store.updateCapacityPrice[mine.levelStore] ||
    (resource.store.priceIsMiracleCoin ? mCoin : coin) <
      resource.store.updateCapacityPrice[mine.levelStore]
  );
};

export const useImposibleUpdateProductivity = (mineId: MineType["id"]) => {
  const coin = useCommonStore((state) => state.coin);
  const mCoin = useCommonStore((state) => state.mCoin);
  const mines = useCommonStore((state) => state.mines);
  const mine = mines[mineId];
  const availableMines = useCommonStore((state) => state.availableMines);
  const resource = availableMines.find((r) => r.resource.id === mineId);

  if (mine === undefined || resource === undefined) {
    return true;
  }

  if (resource.resource.craftResource.some(({ id }) => !mines[id])) {
    return true;
  }

  return (
    mine.passive.fabricGrade >= resource.passive.speedUpgradePrice.length ||
    (resource.passive.toolPriceIsMiracleCoin ? mCoin : coin) <
      resource.passive.speedUpgradePrice[mine.passive.fabricGrade]
  );
};

export const useImposibleHire = (mineId: MineType["id"]) => {
  const coin = useCommonStore((state) => state.coin);
  const mCoin = useCommonStore((state) => state.mCoin);
  const mines = useCommonStore((state) => state.mines);
  const mine = mines[mineId];
  const availableMines = useCommonStore((state) => state.availableMines);
  const resource = availableMines.find((r) => r.resource.id === mineId);

  if (mine === undefined || resource === undefined) {
    return true;
  }

  if (resource.resource.craftResource.some(({ id }) => !mines[id])) {
    return true;
  }

  const maxWorkers = Math.ceil(
    mine.maxStore / resource.passive.maxWorkersStock
  );
  return (
    (resource.passive.workerPriceIsMiracleCoin ? mCoin : coin) <
      getHireWorkerCount(mine.passive.workerCount, maxWorkers) *
        resource.passive.workerPrice || mine.passive.workerCount >= maxWorkers
  );
};
