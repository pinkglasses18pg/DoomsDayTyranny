// apps/tma/src/components/InitUser.tsx

import { app } from "@/store/firebase";
import { useInitData, useViewport, useCloudStorage } from "@tma.js/sdk-react";
import { getFunctions } from "firebase/functions";
import {
  type InitUserRequest,
  type InitUserResponse,
} from "functions/src/index";
import {PropsWithChildren, useCallback, useEffect, useMemo, useRef} from "react";
import useHttpsCallable from "@/store/useHttpsCallable";
import { useTranslation } from "react-i18next";
import { ConfigItem, GetNewReferralsResponse } from "@/store/types";
import { useCommonStore } from "./StoreContext";
import { LoadIndicator } from "./LoadIndicator";

export const ExpancedViewport = () => {
  const viewport = useViewport();

  useEffect(() => {
    if (viewport) {
      if (!viewport.isExpanded) {
        viewport.expand();
      }
    }
  }, [viewport]);

  return null;
};

export const InitUser = ({ children }: PropsWithChildren) => {
  const initData = useInitData();
  const hasExecutedRef = useRef(false);
  const init = useCommonStore((state) => state.init);
  const buyMine = useCommonStore((state) => state.buyMine);
  const tick = useCommonStore((state) => state.tick);
  const cloudStorage = useCloudStorage();
  const setMapData = useCommonStore((state) => state.setMapData);
  //const initState = useCommonStore((state) => state.initState);
  const setAppState = useCommonStore((state) => state.setAppState);
  const initializeMap = useCommonStore((state) => state.initializeMap);

  const setConfig = useCommonStore((state) => state.setConig);
  const { i18n } = useTranslation();

  const functions = useMemo(() => getFunctions(app), []);

  const [initUserCallback, loading] = useHttpsCallable<
    InitUserRequest,
    InitUserResponse
  >(functions, "initUser");

  // Настройка функции проверки новых реферралов
  const [getNewReferrals] = useHttpsCallable<
      InitUserRequest,
      GetNewReferralsResponse
  >(functions, "getNewReferrals");

  const init_referral_code = useCallback(async () => {

    let referralCode_: string | null = null; // Explicitly typed
    if (window.location.search) {
      const params = new URLSearchParams(window.location.search);
      referralCode_ = params.get("tgWebAppStartParam");
    } else if (window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      referralCode_ = hashParams.get("start_param");
    } else {
      referralCode_ = null;
    }

    if (referralCode_) {
      console.log("Referral code:", referralCode_);
      setAppState({referralCode: referralCode_});
      console.log("Referral code saved in Zustand");
    }
  }, [setAppState]);


  useEffect(() => {
    if (initData === undefined || hasExecutedRef.current) {
      return;
    }

    async function execute() {
      hasExecutedRef.current = true;

        // Check if userID is in cloudStorage
        const storedUserId = await cloudStorage.get("userId");
        const storedUserName = await cloudStorage.get("username");

        let userId = storedUserId;
        let username = storedUserName;

        // If not in cloudStorage, use the one from initData and store it
        if (!userId && initData?.user?.id) {
          userId = initData.user.id.toString();
          cloudStorage.set("userId", userId);  // Save to cloudStorage

        }

        if (!username && initData?.user?.username) {
          username = initData.user.username.toString();
          cloudStorage.set("username", username);
        }


      const result = await initUserCallback();

      if (!result || !result.data || !result.data.config) {
        return;
      }

      const config = result.data.config as unknown as ConfigItem[];

      setConfig(config);

      console.log("FROM InitUser : result: ", result.data.status);
      if (result.data.status === "created") {

        init(200000, 0, {"sand":{"id":"sand","store":{"count":500},
            "maxStore":1000,"levelStore":0,"usagePerMinute":0,"passive":
                {"currentSpeedProductiviy":1,"workerCount":0,"fabricGrade":0,"currentProduceTime":4,
                  "progress":0,"craftPerMinute":0}},"glass":{"id":"glass","store":{"count":2000},
            "maxStore":2250,"levelStore":0,"usagePerMinute":0,"passive":{"currentSpeedProductiviy":1,
              "workerCount":0,"fabricGrade":0,"currentProduceTime":16,"progress":0,"craftPerMinute":0}},
          "sandglass":{"id":"sandglass","store":{"count":0},"maxStore":600,"levelStore":0,"usagePerMinute":0,
            "passive":{"currentSpeedProductiviy":1,"workerCount":0,"fabricGrade":0,"currentProduceTime":16,
              "progress":0,"craftPerMinute":0}}});
        initializeMap(12, 9, 2, 2);
        setAppState({isNewUser: true});
        setAppState({userInitialized: true});
        return;
      }

      //console.log("initState from initUser.tsx : ", initState);
      //console.log("isNewUser is : ", isNewUser);

      console.log("next will gameStats");

      try {
        if (!result.data.gameStats) {
          throw new Error("gameStats is empty");
        }

        if (!result.data.mapData) {
          console.log("mapData is empty");
        }

        const gameStats = JSON.parse(result.data.gameStats);

        const ticks = result.data.ticks;

        const { mines, coin, mCoin } = gameStats;


        if (result.data.mapData) {
          const mapData_ = JSON.parse(result.data.mapData);
          setMapData(mapData_);
        } else {
          initializeMap(12, 9, 2, 2);
        }

        if (!mines) throw new Error("Invalid gameStats");

        init(coin, mCoin, mines);
        for (let i = 0; i < Math.min(ticks || 0, 432000); i++) {
          tick();
        }


      } catch (e) {
        console.error("Error processing gameStats:", e);
      }

      console.log("next will New referrals check");

      // После инициализации пользователя проверяем наличие новых рефералов
      try {
        // Вызываем бэкенд-функцию для получения новых рефералов
        const result_check = await getNewReferrals();

        if (result_check && result_check.data) {
          console.log("New referrals:", result_check.data);

          if (result_check.data.newReferrals && result_check?.data?.newReferrals?.length > 0) {
            try {
              // Fetch existing referrals from cloudStorage
              const existingReferralsJson = await cloudStorage.get("referrals");
              const existingReferrals = existingReferralsJson
                  ? JSON.parse(existingReferralsJson) // Parse JSON if data exists
                  : [];

              // Add new referrals to the existing list
              const updatedReferrals = [
                ...existingReferrals,
                ...result_check.data.newReferrals.map((ref) => ref.username),
              ];

              // Save updated referrals list to cloudStorage
              await cloudStorage.set("referrals", JSON.stringify(updatedReferrals));

              setAppState({newReferrals: result_check.data.newReferrals});

            } catch (error) {
              console.error("Error marking referrals as read:", error);
            }
          }

        }
      } catch (error) {
        console.error("Error fetching new referrals:", error);
      }
      console.log("userInitialized next:");
      // Set initialization flag after completing user setup
      setAppState({userInitialized: true});

    }

    init_referral_code();
    execute();

  }, [initData, initUserCallback, buyMine, init, setConfig, cloudStorage, init_referral_code,
    tick, getNewReferrals, setMapData, initializeMap]);

  useEffect(() => {
    cloudStorage.get("languageCode").then((value) => {
      if (value === undefined && initData && initData.user?.languageCode) {
        i18n.changeLanguage(initData.user.languageCode);

        cloudStorage.set("languageCode", initData.user.languageCode);
      } else {
        i18n.changeLanguage(value);
      }
    });
  }, [initData, i18n, cloudStorage]);

  return (
    <>
      <ExpancedViewport />
      {loading ? <LoadIndicator /> : children}
    </>
  );
};
