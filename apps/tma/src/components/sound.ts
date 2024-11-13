import { useCommonStore } from "./StoreContext";

type SoundType = "buyFabric" | "click" | "farm" | "mistake" | "sellResurce" | "switch" | "upgrade";

export const useSound = (sound: SoundType) => {
  const onSound = useCommonStore((state) => state.onSound);

  const audio = new Audio(`/assets/sound/soundEffect/${sound}.ogg`);

  return onSound ? audio : null;
};
