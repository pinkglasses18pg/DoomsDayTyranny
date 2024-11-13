import { useEffect, useRef } from "react";
import { getFunctions } from "firebase/functions";
import useHttpsCallable from "@/store/useHttpsCallable";
import { app } from "@/store/firebase";
import { useCommonStore } from "./StoreContext";

export const SaveGame = () => {
  const mines = useCommonStore((state) => state.mines);
  const coin = useCommonStore((state) => state.coin);
  const mCoin = useCommonStore((state) => state.mCoin);

  const [executeCallable] = useHttpsCallable(getFunctions(app), "save");

  const latestGameStatsRef = useRef({ coin, mCoin, mines });

  useEffect(() => {
    latestGameStatsRef.current = { coin, mines, mCoin };
  }, [coin, mCoin, mines]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      executeCallable({
        gameStats: JSON.stringify(latestGameStatsRef.current),
      });
    }, 30_000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
