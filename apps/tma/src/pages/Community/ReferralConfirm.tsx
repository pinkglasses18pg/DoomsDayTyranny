// apps/tma/src/pages/Community/ReferralConfirm.tsx

import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import {useCommonStore} from "@/components/StoreContext.tsx";

import useHttpsCallable from "@/store/useHttpsCallable";
import { getFunctions } from "firebase/functions";
import { app } from "@/store/firebase";
import {useTranslation} from "react-i18next";

const ReferralConfirmPage: React.FC = () => {

  const setAppState = useCommonStore((state) => state.setAppState);
  const initState = useCommonStore((state) => state.initState);
  const newReferrals = useCommonStore((state) => state.newReferrals);

  // Инициализация навигатора
  const navigate = useNavigate();

  const [markReferralsAsRead] = useHttpsCallable(getFunctions(app), "markReferralsAsRead");

  const {t} = useTranslation();


  useEffect(() => {
    // Retrieve new referrals from cloudStorage
    if (initState === "referralParent") {
      console.log("New Referrals found: ", newReferrals);
    } else {
      console.log("No New Referrals found.");
    }
  }, [initState, newReferrals]);

  const handleTakeReward = async () => {
    const results = await markReferralsAsRead();
    console.log("From ReferralConfirm.tsx :: markReferralsAsRead results: ", results);
    // Обновление данных в базе с использованием облачной функции "save"
    setAppState({ initState: "done", newReferrals: [] });
    setTimeout(() => setAppState({ newReferrals: [] }), 3000);
    navigate("/");
  };



  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-darkM text-whiteM font-roboto p-5">
      <div className="mb-5">
        <img
          src="./assets/icons/workers_frame.svg" // Заменить на актуальный путь к иконке
          alt="Radiation Logo"
          className="w-20 h-20"
        />
      </div>
      <h1 className="text-2xl mb-2">{t("congratulations")}</h1>
      {newReferrals ? (
          <div>
            <h2>{t("newWorkers")}</h2>
            <ul>
              {newReferrals.map((referral) => (
                  <li key={referral.id}>
                    <strong>{referral.username}</strong> (Telegram ID: {referral.id})
                  </li>
              ))}
            </ul>
          </div>
      ) : (
          <h1>No referral code available.</h1>
      )}

      <button className="bg-yellow-500 text-black rounded-lg px-8 py-3 text-lg hover:opacity-90"
              onClick={handleTakeReward}>{t("great")}</button>
    </div>
  );
};

/*const styles = {
  container: {
    backgroundColor: "#1A1A1A", // Тёмный фон
    color: "white",
    textAlign: "center" as const, // Тип кастинга для TypeScript
    fontFamily: "'Roboto', sans-serif",
    padding: "20px",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
  },
  logoWrapper: {
    marginBottom: "20px",
  },
  logo: {
    width: "80px",
    height: "80px",
  },
  congratulations: {
    fontSize: "24px",
    marginBottom: "10px",
  },
  message: {
    fontSize: "16px",
    marginBottom: "20px",
  },
  playerName: {
    color: "#FFD700", // Жёлтый цвет для имени игрока
  },
  rewardLabel: {
    fontSize: "18px",
    marginBottom: "5px",
  },
  rewardAmount: {
    fontSize: "48px",
    fontWeight: "bold" as const,
    color: "#FFFFFF",
    marginBottom: "40px",
  },
  takeButton: {
    backgroundColor: "#FFD700", // Жёлтая кнопка
    color: "#000000",
    border: "none",
    borderRadius: "10px",
    padding: "10px 30px",
    fontSize: "20px",
    cursor: "pointer",
  },
};*/

export default ReferralConfirmPage;