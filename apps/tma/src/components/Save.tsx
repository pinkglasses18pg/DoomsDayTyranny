// apps/tma/src/components/Save.tsx

import { useEffect, useRef } from "react";
import { getFunctions } from "firebase/functions";
import useHttpsCallable from "@/store/useHttpsCallable";
import { app } from "@/store/firebase";
import { useCommonStore } from "./StoreContext";

export const SaveGame = () => {
  const mines = useCommonStore((state) => state.mines);
  const coin = useCommonStore((state) => state.coin);
  const mCoin = useCommonStore((state) => state.mCoin);
  const mapData = useCommonStore((state) => state.mapData);

  const [executeCallable] = useHttpsCallable(getFunctions(app), "save");

  const latestGameStatsRef = useRef({ coin, mCoin, mines, mapData });

  useEffect(() => {
    latestGameStatsRef.current = { coin, mines, mCoin, mapData };
  }, [coin, mCoin, mines, mapData]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      executeCallable({
        gameStats: JSON.stringify({
          coin: latestGameStatsRef.current.coin,
          mCoin: latestGameStatsRef.current.mCoin,
          mines: latestGameStatsRef.current.mines,
        }),
        mapData: JSON.stringify(latestGameStatsRef.current.mapData), // Include mapData
      });
    }, 30_000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
