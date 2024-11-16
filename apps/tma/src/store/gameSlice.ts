// apps/tma/src/pages/store/gameSlice.ts

import {
  ConfigItem,
  ConfigSlice,
  MineType,
  Mines,
  SliceCreator,
  UserGameSlice,
} from "./types";

export const createGameSlice: SliceCreator<keyof UserGameSlice> = (
  set,
  get
) => ({
  coin: 0,
  mCoin: 0,
  mines: {},
  buyMine: (mineId: MineType["id"]) => {
    set((state) => {
      const resources = get().availableMines;
      const mine = resources.find((r) => r.resource.id === mineId);

      if (mine === undefined) {
        return;
      }

      state.coin -= mine.unlockPrice;
      state.mines[mine.resource.id] = {
        id: mine.resource.id,
        store: {
          count: 0,
        },
        maxStore: mine.store.updateCapacityCount[0],
        levelStore: 0,
        usagePerMinute: 0,
        passive: {
          currentSpeedProductiviy: 1,
          workerCount: 0,
          fabricGrade: 0,
          currentProduceTime: mine.passive.produceTime,
          progress: 0,
          craftPerMinute: 0,
        },
      };
    });
  },

  toMine: (mineId: MineType["id"]) => {
    set((state) => {
      const mine = state.mines[mineId];
      const resources = get().availableMines;
      const resource = resources.find((r) => r.resource.id === mineId);

      if (mine === undefined || resource === undefined) {
        return;
      }

      if (isImpossibleMine(mine, resource, state.mines)) {
        return;
      }

      resource.resource.craftResource.forEach(({ id, count }) => {
        const mineInState = state.mines[id];

        if (mineInState === undefined) {
          return;
        }

        mineInState.store.count -= count;
      });

      mine.store.count += 1;
    });
  },

  sellStore: (mineId: MineType["id"]) => {
    set((state) => {
      const mine = state.mines[mineId];
      const resources = get().availableMines;
      const resource = resources.find((r) => r.resource.id === mineId);
      if (mine === undefined || resource === undefined) {
        return;
      }

      if (resource.sellIsMiriclaCoint) {
        state.mCoin += mine.store.count * resource.sellPrice;
      } else {
        state.coin += mine.store.count * resource.sellPrice;
      }

      state.mines[mine.id]!.store.count = 0;
    });
  },

  updateStore: (mineId: MineType["id"]) => {
    set((state) => {
      const mine = state.mines[mineId];
      const resources = get().availableMines;
      const resource = resources.find((r) => r.resource.id === mineId);
      if (mine === undefined || resource === undefined) {
        return;
      }
      if (!resource.store.updateCapacityPrice[mine.levelStore]) {
        return;
      }
      if (resource.store.priceIsMiracleCoin) {
        state.mCoin -= resource.store.updateCapacityPrice[mine.levelStore];
      } else {
        state.coin -= resource.store.updateCapacityPrice[mine.levelStore];
      }
      mine.maxStore = resource.store.updateCapacityCount[mine.levelStore + 1];
      mine.levelStore += 1;
    });
  },

  updateSpeedProductivity: (mineId: MineType["id"]) => {
    set((state) => {
      const mine = state.mines[mineId];
      const resources = get().availableMines;
      const resource = resources.find((r) => r.resource.id === mineId);

      if (mine === undefined || resource === undefined) {
        return;
      }

      if (resource.resource.craftResource.some(({ id }) => !state.mines[id])) {
        return;
      }

      // extract copy past
      const craftPerMinuteBefore = mine.passive.craftPerMinute;
      const newSpeed =
        resource.passive.speedProductivity[mine.passive.fabricGrade];
      const craftPerMinuteAfter =
        (60 / resource.passive.produceTime) *
        mine.passive.workerCount *
        newSpeed;
      mine.passive.craftPerMinute = craftPerMinuteAfter;

      resource.resource.craftResource.forEach(({ id, count }) => {
        const resourceMine = state.mines[id];
        if (!resourceMine) {
          return;
        }
        resourceMine.usagePerMinute +=
          (craftPerMinuteAfter - craftPerMinuteBefore) * count;
      });

      if (resource.passive.toolPriceIsMiracleCoin) {
        state.mCoin -=
          resource.passive.speedUpgradePrice[mine.passive.fabricGrade];
      } else {
        state.coin -=
          resource.passive.speedUpgradePrice[mine.passive.fabricGrade];
      }
      mine.passive.currentSpeedProductiviy = newSpeed;
      mine.passive.currentProduceTime =
        resource.passive.produceTime / mine.passive.currentSpeedProductiviy;
      state.mines[mine.id]!.passive.fabricGrade += 1;
    });
  },

  hireWorker: (mineId: MineType["id"]) => {
    set((state) => {
      const mine = state.mines[mineId];
      const resources = get().availableMines;
      const resource = resources.find((r) => r.resource.id === mineId);
      if (mine === undefined || resource === undefined) {
        return;
      }

      const maxWorkers = Math.ceil(
        mine.maxStore / resource.passive.maxWorkersStock
      );
      if (mine.passive.workerCount >= maxWorkers) {
        return;
      }

      if (resource.resource.craftResource.some(({ id }) => !state.mines[id])) {
        return;
      }

      const hireCount = getHireWorkerCount(
        mine.passive.workerCount,
        maxWorkers
      );

      if (resource.passive.workerPriceIsMiracleCoin) {
        state.mCoin -= resource.passive.workerPrice * hireCount;
      } else {
        state.coin -= resource.passive.workerPrice * hireCount;
      }
      // extract copy past
      const craftPerMinuteBefore = mine.passive.craftPerMinute;
      const craftPerMinuteAfter =
        (60 / resource.passive.produceTime) *
        ((mine.passive.workerCount + hireCount) *
          mine.passive.currentSpeedProductiviy);
      mine.passive.craftPerMinute = craftPerMinuteAfter;
      resource.resource.craftResource.forEach(({ id, count }) => {
        const resourceMine = state.mines[id];
        if (!resourceMine) {
          return;
        }
        resourceMine.usagePerMinute +=
          (craftPerMinuteAfter - craftPerMinuteBefore) * count;
      });

      mine.passive.workerCount += hireCount;
    });
  },

  tick: () => {
    set((state) => {
      const mines = state.mines;
      const resources = get().availableMines;
      Object.values(mines).forEach((mine) => {
        if (!mine || mine.passive.workerCount <= 0) {
          return;
        }
        const resource = resources.find((r) => r.resource.id === mine.id);
        if (!resource) {
          return;
        }

        if (mine.passive.progress === 0) {
          if (isPosibleCraft(mine, resource, mines)) {
            resource.resource.craftResource.forEach(({ id, count }) => {
              const resourceMine = state.mines[id];
              if (resourceMine) {
                resourceMine.store.count -= count * mine.passive.workerCount;
              }
            });
          } else {
            return;
          }
        }

        mine.passive.progress += mine.passive.currentSpeedProductiviy / 10;
        if (mine.passive.progress < resource.passive.produceTime) {
          return;
        }

        const crafted = mine.passive.workerCount;
        if (mine.store.count + crafted > mine.maxStore) {
          mine.store.count = mine.maxStore; //overflow
        } else {
          mine.store.count += crafted;
        }

        mine.passive.progress = 0;
      });
    });
  },

  init: (coin, mCoin, mines) => {
    set({ coin, mCoin, mines });
  },
});

export const isImpossibleMine = (
  mine: MineType,
  resource: ConfigItem,
  mines: Mines
): boolean =>
  mine.store.count >= mine.maxStore ||
  resource.resource.craftResource.some(({ id, count }) => {
    return (mines[id]?.store.count ?? 0) < count;
  });

const getWorkerGrade = (count: number): number => {
  if (count < 10) return 1;
  if (count < 60) return 5;
  if (count < 100) return 10;
  if (count < 500) return 50;
  if (count < 1000) return 100;
  if (count < 5000) return 500;
  return 1000;
};

export const getHireWorkerCount = (
  currentWorker: number,
  maxWorkers: number
): number => {
  const wantHireWorker = getWorkerGrade(currentWorker);
  if (currentWorker + wantHireWorker > maxWorkers) {
    return maxWorkers - currentWorker;
  }
  return wantHireWorker;
};

export const isPosibleCraft = (
  mine: MineType,
  resource: ConfigSlice["availableMines"][0],
  mines: UserGameSlice["mines"]
) => {
  if (mine.maxStore === mine.store.count) {
    return false;
  }

  return resource.resource.craftResource.every(({ id, count }) => {
    const resourceMine = mines[id];
    return (
      resourceMine &&
      resourceMine.store.count >= count * mine.passive.workerCount
    );
  });
};

export const isImpossibleSell = (mine: MineType) => mine.store.count <= 0;
