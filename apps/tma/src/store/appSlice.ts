// apps/tma/src/store/appSlice.tsx

import { SliceCreator, AppSlice } from "./types";

export const createAppSlice: SliceCreator<keyof AppSlice> = (set) => ({
  initState: "loading",
  onMusic: true,
  onSound: true,
  setAppState: (stateOrUpdater) => {
    console.log("Updating state with:", stateOrUpdater);
    if (typeof stateOrUpdater === "function") {
      set((prevState) => {
        const newState = stateOrUpdater(prevState);
        // Проверяем, изменилось ли состояние
        console.log("Previous state:", prevState.initState);
        console.log("New state:", newState.initState);
        if (JSON.stringify(prevState) !== JSON.stringify(newState)) {
          return { ...prevState, ...newState };
        }
        return prevState; // Не обновляем состояние, если оно не изменилось
      });
    } else {
      set((prevState) => {
        const newState = { ...prevState, ...stateOrUpdater };
        console.log("Previous state:", prevState.initState);
        console.log("New state:", newState.initState);
        if (JSON.stringify(prevState) !== JSON.stringify(newState)) {
          return newState;
        }
        return prevState;
      });
    }
  },
  referralCode: null,

  userInitialized: false,

  isNewUser: false,

  newReferrals: [],

});
