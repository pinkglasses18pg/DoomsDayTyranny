// apps/tma/src/store/types.ts

import { StateCreator, StoreMutatorIdentifier } from "zustand/vanilla";
import { Store } from "./store";

export type ResourceType = {
  id: string;
  name: string;
  image: string;
  craftImage: string;
  craftResource: {
    id: ResourceType["id"];
    image: string;
    count: number;
  }[];
};

export interface ConfigItem {
  resource: ResourceType;
  sellPrice: number;
  sellIsMiriclaCoint: boolean;
  unlockPrice: number;
  itReferalRecurce: boolean;
  notManualMining: boolean;
  store: {
    updateCapacityPrice: number[];
    updateCapacityCount: number[];
    priceIsMiracleCoin: boolean;
  };
  passive: {
    toolPriceIsMiracleCoin: boolean;
    workerPriceIsMiracleCoin: boolean;
    speedProductivity: number[];
    speedUpgradePrice: number[];
    workerPrice: number;
    workerProductivity: number;
    maxWorkersStock: number;
    produceTime: number;
  };
}

export interface GetNewReferralsResponse {
  success: boolean;
  newReferrals: ReferralChild[];
}

export interface ConfigSlice {
  availableMines: ConfigItem[];
  setConig: (conf: ConfigItem[]) => void;
}

export type InitState = "loading" | "init" | "langSetted" | "done" | "referral" | "referralParent";

export interface ReferralChild {
  id: string;
  isRead: boolean;
  username: string;
}

export interface AppSlice {
  initState: InitState;
  onMusic: boolean;
  onSound: boolean;
  setAppState: (
      state:
          | Partial<AppSlice>
          | ((prevState: AppSlice) => Partial<AppSlice> | AppSlice)
  ) => void;

  referralCode: string | null;

  userInitialized: boolean;

  isNewUser: boolean;

  newReferrals: ReferralChild[];
}

export type MineType = {
  id: string;
  store: {
    count: number;
  };
  maxStore: number;
  levelStore: number;
  usagePerMinute: number;
  passive: {
    currentSpeedProductiviy: number;
    workerCount: number;
    fabricGrade: number;
    currentProduceTime: number;
    progress: number;
    craftPerMinute: number;
  };
};

export type CraftRequirement = {
  id: string; // The resource ID
  count: number; // The required count for the resource
};

export type Mines = Partial<Record<string, MineType>>;

export interface UserGameSlice {
  coin: number;
  mCoin: number;
  mines: Mines;
  buyMine: (mineId: MineType["id"]) => void;
  toMine: (mineId: MineType["id"]) => void;
  sellStore: (mineId: MineType["id"]) => void;
  updateStore: (mineId: MineType["id"]) => void;
  updateSpeedProductivity: (mineId: MineType["id"]) => void;
  canCraftEvent: ( CraftRequirements: CraftRequirement[]) => boolean;
  useResources: ( CraftRequirements: CraftRequirement[]) => void;
  buyEvent: (price: number) => void;
  takeRewards: (reward: Rewards) => void;
  hireWorker: (mineId: MineType["id"]) => void;
  tick: () => void;
  init: (coin: number, mCoin: number, mines: Mines) => void;
  setMCoin: (newMCoin: number) => void;
  setCoin: (newCoin: number) => void;
}

export type ImmerStateCreator<
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
> = StateCreator<T, [...Mps, ["zustand/immer", never]], Mcs>;

export type MyAppStateCreator = ImmerStateCreator<Store>;

export type SliceCreator<TSlice extends keyof Store> = (
  ...params: Parameters<MyAppStateCreator>
) => Pick<ReturnType<MyAppStateCreator>, TSlice>;

export type TileType = {
  id: string;
  x: number;
  y: number;
  owner: string;
  hasEvent: boolean;
  eventId?: string;
  attempts: number;
}

export type MapType = {
  id: string;
  tiles: TileType[];
  tileSetId: string;
  startPoint: number;
}

// For events types:
export type CraftResource = {
  id: string;
  image: string;
  count: number;
};

export type Difficulty = {
  baseChance: number;
  tryMultiplay: number;
};

export type Generation = {
  tileList: string[]; // Array of tile IDs
  weight: number;
  isFixedEvent: boolean;
};

export type Rewards = {
  hardReward: number;
  softReward: number;
  resourceReward: string[]; // IDs of rewarded resources
};

export type EventType = {
  id: string;
  name: string;
  type: string; // e.g., "Capture", "Build"
  description: string;
  image: string;
  questImage: string;
  icon: string;
  iconBg: string;
  relatedEvents: string[]; // IDs of related events
  craftEvent: CraftResource[]; // Resources required to complete the event
  price: number; // Cost of the event
  difficulty: Difficulty;
  generation: Generation;
  rewards: Rewards;
};

export type EventSlice = {
  events: EventType[];
  getEventById: (eventId: string) => EventType | undefined;
};

export type MapSlice = {
  mapData: TileType[];
  setMapData: (mapData: TileType[]) => void;
  initializeMap: (width: number, height: number, centerX: number, centerY: number) => void;
  generateEventsForMap: (capturedTile: TileType) => void;
  updateTileOwner: (tileId: string, newOwner: string) => void;
  getTileById: (tileId: string) => TileType | undefined;
  incrementTileAttempts: (tileId: string) => void;
  completeEvent: (tileId: string) => void;
  isTileNeighborOfPlayer: (tileId: string) => boolean;
};
