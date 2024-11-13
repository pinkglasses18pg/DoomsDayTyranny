// apps/tma/src/pages/Community/Invite.tsx

import React, { useEffect,  useState } from "react";

// import workers_frame from "@/assets/icons/workers_frame.svg";
import { useNavigate } from "react-router-dom";
import { getFunctions } from "firebase/functions";
import useHttpsCallable from "@/store/useHttpsCallable";
import { app } from "@/store/firebase";
import { useCommonStore } from "@/components/StoreContext";

const InvitePage: React.FC = () => {
  const {mines, coin, mCoin} = useCommonStore((state) => ({
    mines: state.mines,
    coin: state.coin,
    mCoin: state.mCoin,
  }));
  //const setAppState = useCommonStore((state) => state.setAppState);
  const init = useCommonStore((state) => state.init);

  //const [referralCode, setReferralCode] = useState<string | null>(null);

  // Инициализация навигатора
  const navigate = useNavigate();
  const [executeCallable] = useHttpsCallable(getFunctions(app), "save");

  // Состояние для хранения игровых статистик
  const [latestGameStats, setLatestGameStats] = useState({coin: coin + 666, mCoin, mines});

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userData, setUserData] = useState<any>(null);
  const [isReaded, setIsReaded] = useState<boolean>(false);

  const referralCode = useCommonStore((state) => state.referralCode);


  useEffect(() => {
    // Retrieve referral code from cloudStorage
      if (referralCode) {
        console.log("ReferralCode: ", referralCode);
      } else {
        console.log("No referral code found.");
      }

  });

  const [fetchUserById] = useHttpsCallable(getFunctions(app), 'getUserById');

  const fetchUser = async () => {
    if (!isReaded && referralCode) {
      try {
        setIsReaded(true);
        console.log("from InvitePage: referralCode: ", referralCode || null);
        const result = await fetchUserById({id: referralCode});
        setUserData(result?.data || null);
        console.log("from InvitePage: ", result?.data || null);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    }
  };

  fetchUser();

  const handleTakeReward = () => {

    if (!referralCode || !userData || !isReaded) {
      console.error("Required data is missing");
      return;
    }


      setLatestGameStats({ coin: coin + 666, mCoin, mines });
      init(666, mCoin, mines);

      // Обновление данных в базе с использованием облачной функции "save"
    executeCallable({
        gameStats: JSON.stringify(latestGameStats),
        referredParent: referralCode,
      })
      .then((result) => {
          if (result && result.data) {
        console.log("Data saved successfully:", result.data);
        navigate("/"); // Перенаправление на главную страницу после успешного сохранения
        } else {
      console.error("No data returned from callable function.");
    }
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  navigate("/"); // Simplified navigation
  };



  return (
    <div style={styles.container}>
      <div style={styles.logoWrapper}>
        <img
          src="./assets/icons/workers_frame.svg" // Заменить на актуальный путь к иконке
          alt="Radiation Logo"
          style={styles.logo}
        />
      </div>
      <h1 style={styles.congratulations}>Congratulations!</h1>
      {referralCode ? (
        <h1>Now you work at the uranium mine of the player {userData?.user?.username || null}</h1>
      ) : (
        <h1>No referral code available.</h1>
      )}
      <p style={styles.rewardLabel}>Your reward</p>
      <p style={styles.rewardAmount}>666 ¥</p>
      <button style={styles.takeButton} onClick={handleTakeReward}>Take</button>
    </div>
  );
};

const styles = {
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
};

export default InvitePage;
