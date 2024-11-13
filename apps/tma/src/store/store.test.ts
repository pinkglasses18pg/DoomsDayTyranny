// import { describe, expect, test, beforeEach } from "vitest";
// import {
//   availableMines,
//   isImposibleUpdateProductivity,
//   userStore,
//   UserStoreType,
// } from "./store";

// vi.mock("../config.json", () => ({
//   default: [
//     {
//       resource: {
//         id: "mock sand",
//         name: "mock sand",
//         image: "assets/sand.png",
//         craftResource: [],
//       },
//       sellPrice: 1,
//       sellIsMiriclaCoint: false,
//       unlockPrice: 0,
//       store: {
//         updateCapacityPrice: [1, 2],
//         updateCapacityCount: [20, 30],
//         priceIsMiracleCoin: false,
//       },
//       passive: {
//         toolPriceIsMiracleCoin: false,
//         workerPriceIsMiracleCoin: false,
//         speedProductivity: [2, 3, 4, 12],
//         speedUpgradePrice: [100, 200, 300, 400],
//         workerPrice: 100,
//         workerProductivity: 1,
//         maxWorkers: 10,
//         produceTime: 120,
//       },
//     },
//     {
//       resource: {
//         id: "mock glass",
//         name: "Mock Glass",
//         image: "assets/glass.png",
//         craftResource: [
//           {
//             id: "mock sand",
//             image: "assets/sand.png",
//             count: 1,
//           },
//         ],
//       },
//       sellPrice: 2,
//       sellIsMiriclaCoint: false,
//       unlockPrice: 10,
//       store: {
//         updateCapacityPrice: [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024],
//         updateCapacityCount: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
//         priceIsMiracleCoin: false,
//       },
//       passive: {
//         toolPriceIsMiracleCoin: false,
//         workerPriceIsMiracleCoin: false,
//         speedProductivity: [2, 3, 4],
//         speedUpgradePrice: [100, 200, 300],
//         workerPrice: 100,
//         workerProductivity: 1,
//         maxWorkers: 10,
//         produceTime: 120,
//       },
//     },
//     {
//       resource: {
//         id: "coal",
//         name: "Coal",
//         image: "assets/coal.png",
//         craftResource: [
//           {
//             id: "mock sand",
//             image: "assets/sand.png",
//             count: 10,
//           },
//         ],
//       },
//       sellPrice: 1,
//       sellIsMiriclaCoint: false,
//       unlockPrice: 30,
//       store: {
//         updateCapacityPrice: [3, 6, 12, 24, 48, 96, 192, 384, 768, 1536],
//         updateCapacityCount: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
//         priceIsMiracleCoin: false,
//       },
//       passive: {
//         toolPriceIsMiracleCoin: false,
//         workerPriceIsMiracleCoin: false,
//         speedProductivity: [1, 2, 3, 4],
//         speedUpgradePrice: [100, 200, 300, 400],
//         workerPrice: 100,
//         workerProductivity: 1,
//         maxWorkers: 10,
//         produceTime: 120,
//       },
//     },
//     {
//       resource: {
//         id: "dimond",
//         name: "Dimand",
//         image: "dimond.png",
//         craftResource: [],
//       },
//       sellPrice: 1,
//       sellIsMiriclaCoint: true,
//       unlockPrice: 30,
//       store: {
//         updateCapacityPrice: [3, 6, 12, 24, 48, 96, 192, 384, 768, 1536],
//         updateCapacityCount: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
//         priceIsMiracleCoin: false,
//       },
//       passive: {
//         toolPriceIsMiracleCoin: false,
//         workerPriceIsMiracleCoin: false,
//         speedProductivity: [1, 2, 3, 4],
//         speedUpgradePrice: [100, 200, 300, 400],
//         workerPrice: 100,
//         workerProductivity: 1,
//         maxWorkers: 10,
//         produceTime: 120,
//       },
//     },
//   ],
// }));

// const firstMine = availableMines[0];
// const secondMine = availableMines[1];
// const thirdMine = availableMines[2];
// const miracleMine = availableMines[3];

// describe("userStore", () => {
//   let store: UserStoreType;

//   beforeEach(() => {
//     userStore.setState({ coin: 1000000, mines: {} });
//     store = new Proxy(userStore.getState(), {
//       get: (_, prop) => {
//         const state = userStore.getState();

//         return state[prop as keyof UserStoreType];
//       },
//     });
//   });

//   test("should initialize with default values", () => {
//     expect(store.coin).toBe(1000000);
//     expect(store.mines).toEqual({});
//   });

//   test("should buy a mine", () => {
//     store.buyMine(secondMine.id);

//     const { mines, coin } = userStore.getState();

//     expect(coin).toBe(1000000 - secondMine.unlockPrice);
//     expect(mines[secondMine.id]).toEqual(secondMine);
//   });

//   test("should mine resources", () => {
//     store.buyMine(firstMine.id);
//     store.toMine(firstMine.id);

//     expect(store.mines[firstMine.id]?.store.count).toBe(1);
//     expect(store.coin).toBe(1000000);
//   });

//   test("should sell store resources", () => {
//     store.buyMine(firstMine.id);
//     store.toMine(firstMine.id);
//     store.sellStore(firstMine.id);

//     expect(store.mines[firstMine.id]?.store.count).toBe(0);
//     expect(store.coin).toBe(1000001);
//   });

//   test("should sell store resources with miracle coin", () => {
//     store.buyMine(miracleMine.id);
//     store.toMine(miracleMine.id);
//     store.sellStore(miracleMine.id);

//     expect(store.mines[miracleMine.id]?.store.count).toBe(0);
//     expect(store.mCoin).toBe(1);
//   });

//   test("should update store capacity", () => {
//     store.buyMine(firstMine.id);
//     const initialMaxStore = firstMine.maxStore;
//     store.updateStore(firstMine.id);

//     expect(store.coin).toBe(
//       1000000 - firstMine.unlockPrice - firstMine.store.updateCapacityPrice[0]
//     );
//     expect(store.mines[firstMine.id]?.maxStore).toBe(initialMaxStore + 10);
//     expect(store.mines[firstMine.id]?.levelStore).toBe(1);
//   });

//   test("should update speed productivity", () => {
//     store.buyMine(firstMine.id);

//     const initialFabricGrade = firstMine.passive.fabricGrade;
//     store.updateSpeedProductivity(firstMine.id);
//     expect(store.coin).toBe(
//       1000000 -
//         firstMine.unlockPrice -
//         firstMine.passive.speedUpgradePrice[initialFabricGrade]
//     );
//     expect(store.mines[firstMine.id]?.passive.fabricGrade).toBe(
//       initialFabricGrade + 1
//     );
//   });

//   test("should hire a worker", () => {
//     store.buyMine(firstMine.id);
//     const initialWorkerCount = firstMine.passive.workerCount;
//     store.hireWorker(firstMine.id);
//     expect(store.coin).toBe(
//       1000000 - firstMine.unlockPrice - firstMine.passive.workerPrice
//     );
//     expect(store.mines[firstMine.id]?.passive.workerCount).toBe(
//       initialWorkerCount + 1
//     );
//   });

//   test("should produce resource with craft resorce", () => {
//     store.buyMine(firstMine.id);
//     store.toMine(firstMine.id);
//     store.buyMine(secondMine.id);
//     store.toMine(secondMine.id);

//     expect(store.mines[secondMine.id]?.store.count).toEqual(1);
//     expect(store.mines[firstMine.id]?.store.count).toEqual(0);
//   });

//   test("shouln't produce resource with craft resorce if craft resoruce is empty", () => {
//     store.buyMine(secondMine.id);
//     store.toMine(secondMine.id);

//     expect(store.mines[secondMine.id]?.store.count).toEqual(0);
//   });

//   test("should workder mine simple resource", () => {
//     store.buyMine(firstMine.id);
//     store.hireWorker(firstMine.id);

//     for (let i = 0; i < 1201; i++) {
//       store.tick();
//     }

//     expect(store.mines[firstMine.id]?.store.count).toBe(1);
//   });

//   test("should workder mine simple resource twice", () => {
//     store.buyMine(firstMine.id);
//     store.hireWorker(firstMine.id);

//     for (let i = 0; i < 2402; i++) {
//       store.tick();
//     }

//     expect(store.mines[firstMine.id]?.store.count).toBe(2);
//   });

//   test("should not overflow store when workers make more then maxStore", () => {
//     store.buyMine(firstMine.id);

//     store.hireWorker(firstMine.id);
//     store.hireWorker(firstMine.id);
//     store.tick();

//     for (let i = 0; i < firstMine.maxStore - 1; i++) {
//       store.toMine(firstMine.id);
//     }

//     for (let i = 0; i < 1200; i++) {
//       store.tick();
//     }

//     expect(store.mines[firstMine.id]?.store.count).toBe(10);
//   });

//   test("should worker mine complex resource", () => {
//     store.buyMine(firstMine.id);
//     store.buyMine(secondMine.id);
//     store.toMine(firstMine.id);
//     store.hireWorker(secondMine.id);

//     store.tick();
//     expect(store.mines[firstMine.id]?.store.count).toBe(0);

//     for (let i = 0; i < 1200; i++) {
//       store.tick();
//     }

//     expect(store.mines[firstMine.id]?.store.count).toBe(0);
//     expect(store.mines[secondMine.id]?.store.count).toBe(1);
//   });

//   test("should workers mine complex resource", () => {
//     store.buyMine(firstMine.id);
//     store.buyMine(secondMine.id);
//     store.toMine(firstMine.id);
//     store.toMine(firstMine.id);
//     store.hireWorker(secondMine.id);
//     store.hireWorker(secondMine.id);

//     store.tick();
//     expect(store.mines[firstMine.id]?.store.count).toBe(0);

//     for (let i = 0; i < 1200; i++) {
//       store.tick();
//     }

//     expect(store.mines[firstMine.id]?.store.count).toBe(0);
//     expect(store.mines[secondMine.id]?.store.count).toBe(2);
//   });

//   test("should workers mine complex resource only p", () => {
//     store.buyMine(firstMine.id);
//     store.buyMine(secondMine.id);
//     store.toMine(firstMine.id);
//     store.hireWorker(secondMine.id);
//     store.hireWorker(secondMine.id);

//     store.tick();
//     expect(store.mines[firstMine.id]?.store.count).toBe(1);

//     for (let i = 0; i < 1200; i++) {
//       store.tick();
//     }

//     expect(store.mines[firstMine.id]?.store.count).toBe(1);
//     expect(store.mines[secondMine.id]?.store.count).toBe(0);
//   });

//   test("should calculate productivity when hire worker", () => {
//     store.buyMine(firstMine.id);
//     store.hireWorker(firstMine.id);

//     expect(store.mines[firstMine.id]?.passive.craftPerMinute).toBe(0.5);
//   });

//   test("should recalculate productivity when hire worker", () => {
//     store.buyMine(firstMine.id);
//     store.updateSpeedProductivity(firstMine.id);
//     store.hireWorker(firstMine.id);

//     expect(store.mines[firstMine.id]?.passive.craftPerMinute).toBe(1);
//   });

//   test("should calculate productivity when update fabric", () => {
//     store.buyMine(firstMine.id);
//     store.hireWorker(firstMine.id);
//     store.updateSpeedProductivity(firstMine.id);

//     expect(store.mines[firstMine.id]?.passive.craftPerMinute).toBe(1);
//   });

//   test("should calculate productivity when update fabric", () => {
//     store.buyMine(firstMine.id);
//     store.hireWorker(firstMine.id);
//     store.hireWorker(firstMine.id);
//     store.updateSpeedProductivity(firstMine.id);

//     expect(store.mines[firstMine.id]?.passive.craftPerMinute).toBe(2);
//   });

//   test("shouldn't buy workers if basic resource is not exist", () => {
//     store.buyMine(secondMine.id);
//     store.hireWorker(secondMine.id);

//     expect(store.mines[secondMine.id]?.passive.workerCount).toEqual(0);
//   });

//   test("shouldn't buy workers if basic resource is not exist", () => {
//     store.buyMine(secondMine.id);
//     store.updateSpeedProductivity(secondMine.id);

//     expect(store.mines[secondMine.id]?.passive.fabricGrade).toEqual(0);
//   });

//   test("should calculate usage", () => {
//     store.buyMine(firstMine.id);
//     store.buyMine(secondMine.id);
//     store.hireWorker(secondMine.id);
//     store.updateSpeedProductivity(secondMine.id);

//     expect(store.mines[firstMine.id]?.usagePerMinute).toEqual(1);
//   });

//   test("shouldn't update store when store is max is max", () => {
//     store.buyMine(firstMine.id);

//     store.updateStore(firstMine.id);
//     store.updateStore(firstMine.id);
//     store.updateStore(firstMine.id);

//     expect(store.mines[firstMine.id]?.levelStore).toEqual(2);
//     expect(store.mines[firstMine.id]?.maxStore).toEqual(30);
//   });

//   test("should craft resource", () => {
//     store.buyMine(firstMine.id);
//     store.buyMine(thirdMine.id);
//     store.buyMine(secondMine.id);

//     for (let i = 0; i < 10; i++) {
//       store.toMine(firstMine.id);
//     }

//     store.hireWorker(thirdMine.id);
//     store.hireWorker(secondMine.id);

//     for (let i = 0; i < 1201; i++) {
//       store.tick();
//     }

//     expect(store.mines[firstMine.id]?.store.count).toEqual(0);
//     expect(store.mines[secondMine.id]?.store.count).toEqual(0);
//     expect(store.mines[thirdMine.id]?.store.count).toEqual(1);
//   });
// });

// describe("helper functions", () => {
//   let store: UserStoreType;

//   beforeEach(() => {
//     userStore.setState({ coin: 1000000, mines: {} });
//     store = new Proxy(userStore.getState(), {
//       get: (_, prop) => {
//         const state = userStore.getState();

//         return state[prop as keyof UserStoreType];
//       },
//     });
//   });

//   test("isImposibleUpdateProductivity should return true if mine is undefined", () => {
//     const result = isImposibleUpdateProductivity(firstMine.id);
//     expect(result).toBe(true);
//   });

//   test("isImposibleUpdateProductivity should return true if not have coin", () => {
//     store.coin = 0;
//     store.buyMine(firstMine.id);

//     const result = isImposibleUpdateProductivity(firstMine.id);
//     expect(result).toBe(true);
//   });
// });
