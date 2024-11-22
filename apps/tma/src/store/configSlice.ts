// apps/tma/src/store/configSlice.ts

import { ConfigItem, ConfigSlice, SliceCreator } from "./types";

export const createConfigSlice: SliceCreator<keyof ConfigSlice> = (set) => ({
  availableMines: [],
  setConig: (conf: ConfigItem[]) => {
    set({ availableMines: conf });
  },
});
