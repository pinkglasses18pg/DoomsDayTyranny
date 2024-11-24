// apps/tma/src/pages/Community/Invite.tsx

import React, { useEffect,  useState, useCallback } from "react";

// import workers_frame from "@/assets/icons/workers_frame.svg";
import { useNavigate } from "react-router-dom";
import { getFunctions } from "firebase/functions";
import useHttpsCallable from "@/store/useHttpsCallable";
import { app } from "@/store/firebase";
import { useCommonStore } from "@/components/StoreContext";
import {useTranslation} from "react-i18next";

const InvitePage: React.FC = () => {
  const mines = useCommonStore((state) => state.mines);
  const coin = useCommonStore((state) => state.coin);
  const mCoin = useCommonStore((state) => state.mCoin);
  const setAppState = useCommonStore((state) => state.setAppState);
  const init = useCommonStore((state) => state.init);
  const mapData = useCommonStore((state) => state.mapData);

  // Инициализация навигатора
  const navigate = useNavigate();
  const [executeCallable] = useHttpsCallable(getFunctions(app), "save");

  // Состояние для хранения игровых статистик
  const [latestGameStats, setLatestGameStats] = useState({coin: coin + 666, mCoin, mines});

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userData, setUserData] = useState<any>(null);
  const [isReaded, setIsReaded] = useState<boolean>(false);

  const referralCode = useCommonStore((state) => state.referralCode);

  const [fetchUserById] = useHttpsCallable(getFunctions(app), 'getUserById');

    const [isClaimed, setIsClaimed] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

  const {t} = useTranslation();

  const fetchUser = useCallback(async () => {
    if (!isReaded && referralCode) {
        setIsLoading(true);
      try {
        setIsReaded(true);
        console.log("from InvitePage: referralCode: ", referralCode || null);
        const result = await fetchUserById({id: referralCode});
        setUserData(result?.data || null);
        console.log("Fetched user data: ", result?.data || null);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
          setIsLoading(false);
      }
    }
  }, [isReaded, referralCode, fetchUserById]);


  useEffect(() => {
    // Retrieve referral code from cloudStorage
      if (referralCode) {
        console.log("ReferralCode: ", referralCode);
      } else {
        console.log("No referral code found.");
      }

  });

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleTakeReward = useCallback(() => {
      console.log("new handle log!!!!!");

      // Prevent multiple clicks
      if (isClaimed) {
          console.warn("Reward already claimed!");
          return;
      }

    if (!referralCode || !userData ) {
      console.error("Required data is missing");
      return;
    }

    if(!isReaded) {
        console.log("the data isn't read yet!");
        return;
    }

      setIsClaimed(true);


      setLatestGameStats({ coin: coin + 666, mCoin, mines });
      init(coin + 666, mCoin, mines);

      // Обновление данных в базе с использованием облачной функции "save"
    executeCallable({
        gameStats: JSON.stringify(latestGameStats),
        mapData: JSON.stringify(mapData),
        referredParent: referralCode,
      })
      .then((result) => {
          if (result && result.data) {
        console.log("Data saved successfully:", result.data);
        setAppState({ initState : "langSetted"});
        //navigate("/"); // Перенаправление на главную страницу после успешного сохранения
        } else {
      console.error("No data returned from callable function.");
            setAppState({ initState : "langSetted"});
              setTimeout(() => {
                  navigate("/");
              }, 500);
    }
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
    setAppState({ initState : "langSetted"});
      setTimeout(() => {
          navigate("/");
      }, 500); // Simplified navigation
  }, [referralCode, userData, isReaded, coin, mCoin, mines, init, executeCallable, navigate, setAppState]);



  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-darkM text-whiteM font-roboto p-5">
      <div className="mb-5">
        <img
          src="./assets/icons/workers_frame.svg" // Заменить на актуальный путь к иконке
          alt="Radiation Logo"
          className="w-20 h-20"
        />
      </div>
      <h1 className="text-2xl mb-2">Congratulations!</h1>
      {referralCode ? (
        <h1>{t("workAtUraniumMine")}
          <span className="text-yellow-500">{userData?.user?.username || null}</span>
        </h1>
        ) : (
        <h1>No referral code available.</h1>
      )}
      <p className="text-lg mb-1">{t("yourReward")}</p>
      <p className="text-5xl font-bold text-white mb-10">666 ¥</p>
        <button
            className={`bg-yellow-500 text-black rounded-lg px-8 py-3 text-lg ${
                isClaimed ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
            }`}
            onClick={handleTakeReward}
            disabled={isClaimed} // Disable button after claim
        >
            {isClaimed ? t("RewardClaimed") : isLoading ? t("loading") : t("take")}
        </button>
    </div>
  );
};

export default InvitePage;
