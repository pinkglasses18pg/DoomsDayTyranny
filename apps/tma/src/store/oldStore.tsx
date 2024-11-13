// import { create } from "zustand";
// import { immer } from "zustand/middleware/immer";
// import config from "../config.json";

// export const resourceList = config.map(({ resource: { id } }) => id);

// export type ResourceId = (typeof resourceList)[number];

// export type ResourceType = {
//   id: ResourceId;
//   name: string;
//   image: string;
//   craftResource: {
//     id: ResourceType["id"];
//     image: string;
//     count: number;
//   }[];
// };

// export type MineType = {
//   id: ResourceId;
//   resource: ResourceType;
//   sellPrice: number;
//   sellIsMiriclaCoint: boolean;
//   unlockPrice: number;
//   store: {
//     count: number;
//     updateCapacityPrice: number[];
//     updateCapacityCount: number[];
//     priceIsMiracleCoin: boolean;
//   };
//   maxStore: number;
//   levelStore: number;
//   usagePerMinute: number;
//   passive: {
//     toolPriceIsMiracleCoin: boolean;
//     workerPriceIsMiracleCoin: boolean;
//     currentSpeedProductiviy: number;
//     speedProductivity: number[];
//     speedUpgradePrice: number[];
//     workerPrice: number;
//     workerCount: number;
//     fabricGrade: number;
//     produceTime: number;
//     currentProduceTime: number;
//     progress: number;
//     craftPerMinute: number;
//     maxWorkers: number;
//   };
// };

// export const availableMines: MineType[] = config.map((mine) => ({
//   resource: mine.resource,
//   sellPrice: mine.sellPrice,
//   sellIsMiriclaCoint: mine.sellIsMiriclaCoint,
//   unlockPrice: mine.unlockPrice,
//   id: mine.resource.id,
//   store: {
//     count: 0,
//     updateCapacityPrice: mine.store.updateCapacityPrice,
//     updateCapacityCount: mine.store.updateCapacityCount,
//     priceIsMiracleCoin: mine.store.priceIsMiracleCoin,
//   },
//   maxStore: 10,
//   levelStore: 0,
//   usagePerMinute: 0,
//   passive: {
//     toolPriceIsMiracleCoin: false,
//     workerPriceIsMiracleCoin: false,
//     currentSpeedProductiviy: 1,
//     speedProductivity: mine.passive.speedProductivity,
//     speedUpgradePrice: mine.passive.speedUpgradePrice,
//     workerPrice: mine.passive.workerPrice,
//     maxWorkers: mine.passive.maxWorkers,
//     produceTime: mine.passive.produceTime,
//     currentProduceTime: mine.passive.produceTime,
//     workerCount: 0,
//     fabricGrade: 0,
//     progress: 0,
//     craftPerMinute: 0,
//   },
// }));

// export type UserStoreType = {
//   coin: number;
//   mCoin: number;
//   mines: Partial<Record<ResourceId, MineType>>;
//   buyMine: (mineId: MineType["id"]) => void;
//   toMine: (mineId: MineType["id"]) => void;
//   sellStore: (mineId: MineType["id"]) => void;
//   updateStore: (mineId: MineType["id"]) => void;
//   updateSpeedProductivity: (mineId: MineType["id"]) => void;
//   hireWorker: (mineId: MineType["id"]) => void;
//   setInitialMines: (mines: UserStoreType["mines"], coin: number) => void;
//   tick: () => void;
// };

// const userStore = create<UserStoreType>()(
//   immer((set) => ({
//     coin: 0,
//     mCoin: 0,
//     mines: {
//       [availableMines[0]["id"] as ResourceId]: availableMines[0] as MineType,
//     },
//     setInitialMines: (mines: UserStoreType["mines"], coin: number) => {
//       set((state) => {
//         state.mines = mines;
//         state.coin = coin;
//       });
//     },
//     toMine: (mineId: MineType["id"]) => {
//       set((state) => {
//         const mine = state.mines[mineId];

//         if (mine === undefined) {
//           return;
//         }

//         if (isImpossibleMine(mine, state.mines)) {
//           return;
//         }

//         mine.resource.craftResource.forEach(({ id, count }) => {
//           const mineInState = state.mines[id];

//           if (mineInState === undefined) {
//             return;
//           }

//           mineInState.store.count -= count;
//         });

//         mine.store.count += 1;
//       });
//     },
//     sellStore: (mineId: MineType["id"]) => {
//       set((state) => {
//         const mine = state.mines[mineId];
//         if (mine === undefined) {
//           return;
//         }

//         if (mine.sellIsMiriclaCoint) {
//           state.mCoin += mine.store.count * mine.sellPrice;
//         } else {
//           state.coin += mine.store.count * mine.sellPrice;
//         }

//         state.mines[mine.id]!.store.count = 0;
//       });
//     },
//     buyMine: (mineId: MineType["id"]) => {
//       set((state) => {
//         const mine = availableMines.find((m) => m.id === mineId);
//         if (mine === undefined) {
//           return;
//         }

//         state.coin -= mine.unlockPrice;
//         state.mines[mine.id] = { ...mine };
//       });
//     },
//     updateStore: (mineId: MineType["id"]) => {
//       set((state) => {
//         const mine = state.mines[mineId];
//         if (mine === undefined) {
//           return;
//         }
//         if (!mine.store.updateCapacityPrice[mine.levelStore]) {
//           return;
//         }
//         state.coin -= mine.store.updateCapacityPrice[mine.levelStore];
//         mine.maxStore = mine.store.updateCapacityCount[mine.levelStore];
//         mine.levelStore += 1;
//       });
//     },
//     updateSpeedProductivity: (mineId: MineType["id"]) => {
//       set((state) => {
//         const mine = state.mines[mineId];
//         if (mine === undefined) {
//           return;
//         }

//         if (mine.resource.craftResource.some(({ id }) => !state.mines[id])) {
//           return;
//         }

//         // extract copy past
//         const craftPerMinuteBefore = mine.passive.craftPerMinute;
//         const newSpeed =
//           mine.passive.speedProductivity[mine.passive.fabricGrade];
//         const craftPerMinuteAfter =
//           (60 / mine.passive.produceTime) * mine.passive.workerCount * newSpeed;
//         mine.passive.craftPerMinute = craftPerMinuteAfter;

//         mine.resource.craftResource.forEach(({ id, count }) => {
//           const resourceMine = state.mines[id];
//           if (!resourceMine) {
//             return;
//           }
//           resourceMine.usagePerMinute +=
//             (craftPerMinuteAfter - craftPerMinuteBefore) * count;
//         });

//         state.coin -= mine.passive.speedUpgradePrice[mine.passive.fabricGrade];
//         mine.passive.currentSpeedProductiviy = newSpeed;
//         mine.passive.currentProduceTime =
//           mine.passive.produceTime / mine.passive.currentSpeedProductiviy;
//         state.mines[mine.id]!.passive.fabricGrade += 1;
//       });
//     },
//     hireWorker: (mineId: MineType["id"]) => {
//       set((state) => {
//         const mine = state.mines[mineId];
//         if (mine === undefined) {
//           return;
//         }

//         if (mine.passive.workerCount >= mine.passive.maxWorkers) {
//           return;
//         }

//         if (mine.resource.craftResource.some(({ id }) => !state.mines[id])) {
//           return;
//         }

//         const hireCount = getHireWorkerCount(
//           mine.passive.workerCount,
//           mine.passive.maxWorkers
//         );

//         state.coin -= mine.passive.workerPrice * hireCount;
//         // extract copy past
//         const craftPerMinuteBefore = mine.passive.craftPerMinute;
//         const craftPerMinuteAfter =
//           (60 / mine.passive.produceTime) *
//           ((mine.passive.workerCount + hireCount) *
//             mine.passive.currentSpeedProductiviy);
//         mine.passive.craftPerMinute = craftPerMinuteAfter;
//         mine.resource.craftResource.forEach(({ id, count }) => {
//           const resourceMine = state.mines[id];
//           if (!resourceMine) {
//             return;
//           }
//           resourceMine.usagePerMinute +=
//             (craftPerMinuteAfter - craftPerMinuteBefore) * count;
//         });

//         mine.passive.workerCount += hireCount;
//       });
//     },
//     tick: () => {
//       set((state) => {
//         const mines = state.mines;
//         Object.values(mines).forEach((mine) => {
//           if (!mine || mine.passive.workerCount <= 0) {
//             return;
//           }

//           if (mine.passive.progress === 0) {
//             if (isPosibleCraft(mine, mines)) {
//               mine.resource.craftResource.forEach(({ id, count }) => {
//                 const resourceMine = state.mines[id];
//                 if (resourceMine) {
//                   resourceMine.store.count -= count * mine.passive.workerCount;
//                 }
//               });
//             } else {
//               return;
//             }
//           }

//           mine.passive.progress += mine.passive.currentSpeedProductiviy / 10;
//           if (mine.passive.progress < mine.passive.produceTime) {
//             return;
//           }

//           const crafted = mine.passive.workerCount;
//           if (mine.store.count + crafted > mine.maxStore) {
//             mine.store.count = mine.maxStore; //overflow
//           } else {
//             mine.store.count += crafted;
//           }

//           mine.passive.progress = 0;
//         });
//       });
//     },
//   }))
// );

// export const isPosibleCraft = (
//   mine: MineType,
//   mines: UserStoreType["mines"]
// ) => {
//   if (mine.maxStore === mine.store.count) {
//     return false;
//   }

//   return mine.resource.craftResource.every(({ id, count }) => {
//     const resourceMine = mines[id];
//     return (
//       resourceMine &&
//       resourceMine.store.count >= count * mine.passive.workerCount
//     );
//   });
// };

// export const isImpossibleMine = (
//   mine: MineType,
//   mines: UserStoreType["mines"]
// ): boolean =>
//   mine.store.count >= mine.maxStore ||
//   mine.resource.craftResource.some(({ id, count }) => {
//     return (mines[id]?.store.count ?? 0) < count;
//   });

// export const isImpossibleUpdateStore = (mineId: MineType["id"]) => {
//   const { coin, mines } = userStore.getState();
//   const mine = mines[mineId];

//   if (mine === undefined) {
//     return true;
//   }

//   return (
//     !mine.store.updateCapacityPrice[mine.levelStore] ||
//     coin < mine.store.updateCapacityPrice[mine.levelStore]
//   );
// };

// export const isImpossibleSell = (mineId: MineType["id"]) => {
//   const { mines } = userStore.getState();
//   const mine = mines[mineId];

//   if (mine === undefined) {
//     return true;
//   }

//   return mine.store.count <= 0;
// };

// export const isImposibleUpdateProductivity = (mineId: MineType["id"]) => {
//   const { coin, mines } = userStore.getState();
//   const mine = mines[mineId];

//   if (mine === undefined) {
//     return true;
//   }

//   if (mine.resource.craftResource.some(({ id }) => !mines[id])) {
//     return true;
//   }

//   return (
//     mine.passive.fabricGrade >= mine.passive.speedUpgradePrice.length ||
//     coin < mine.passive.speedUpgradePrice[mine.passive.fabricGrade]
//   );
// };

// export const isImposibleHire = (mineId: MineType["id"]) => {
//   const { coin, mines } = userStore.getState();
//   const mine = mines[mineId];

//   if (mine === undefined) {
//     return true;
//   }

//   if (mine.resource.craftResource.some(({ id }) => !mines[id])) {
//     return true;
//   }

//   return (
//     coin <
//       getHireWorkerCount(mine.passive.workerCount, mine.passive.maxWorkers) *
//         mine.passive.workerPrice ||
//     mine.passive.workerCount >= mine.passive.maxWorkers
//   );
// };

// const getWorkerGrade = (count: number): number => {
//   if (count < 10) return 1;
//   if (count < 60) return 5;
//   if (count < 100) return 10;
//   if (count < 500) return 50;
//   return 100;
// };

// export const getHireWorkerCount = (
//   currentWorker: number,
//   maxWorkers: number
// ): number => {
//   const wantHireWorker = getWorkerGrade(currentWorker);
//   if (currentWorker + wantHireWorker > maxWorkers) {
//     return maxWorkers - currentWorker;
//   }
//   return wantHireWorker;
// };

// // setInterval(() => {
// //   userStore.getState().tick();
// // }, 100);
