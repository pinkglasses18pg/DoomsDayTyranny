import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import background from "@/assets/icons/background.svg";
import telegram_icon from "@/assets/icons/telegram_icon.svg";
import alpha_icon from "@/assets/icons/alpha_icon.svg";
import workers_frame from "@/assets/icons/workers_frame.svg"; // Example for the Uranus icon
// import inviteIcon from "@/assets/icons/auto.svg"; // Example for the invite icon
import uranusIcon from "@/assets/icons/uranus.svg"
import { useState } from "react";
import { useCloudStorage } from "@tma.js/sdk-react";
import { useEffect } from "react";

import buttonM from "@/assets/buttonM.svg";
import { Button } from "@headlessui/react";

import { useCommonStore } from "@/components/StoreContext";
import { abbreviateNumber } from "../utils";
// import { WebApp } from "@tma.js/sdk"; // Import Telegram WebApp

const InviteButton = ({
  referralLink,
}: {
  referralLink: string;
}) => {
  const [shared, setShared] = useState(false);

  useEffect(() => {
      const intervalId = setInterval(() => {
      if (shared === true) {
        setShared(false);
          }

        }, 5000); // Poll every 5 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
      },[shared]);

  const handleShareClick = async () => {
      const message = encodeURIComponent(`Check this out! Tap my referral link`);
      const telegramShareUrl = `https://t.me/share/url?url=${referralLink}&text=${message}`;

      // Check if Telegram WebApp share is available
      if (Telegram?.WebApp) {
        Telegram.WebApp.openTelegramLink(telegramShareUrl);
      setShared(true);
    } else {
      console.warn("Telegram WebApp share functionality is not available.");
    }
  };

  return (
    <div className="relative">
      <img src={buttonM} className="w-full h-8" />
      <Button
        className="clip-down absolute top-0 flex items-center w-full h-full disabled:bg-black/50 active:bg-black/50 disabled:text-gray-200 active:text-gray-200"
        onClick={handleShareClick}
      >
        <div className="flex flex-grow items-center">
          <span className="text-xs text-black flex-grow text-center">
            {shared ? "Link Shared!" : "Invite Friends"}
          </span>
        </div>
      </Button>
    </div>
  );
};


const CopyReferralButton = ({ referralLink }: { referralLink: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = async () => {
    try {
      // First attempt: Clipboard API
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
    } catch (error) {
      // Fallback method for restricted contexts
      console.warn("Clipboard API blocked, using fallback method:", error);

      // Create a temporary input element
      const textArea = document.createElement("textarea");
      textArea.value = referralLink;
      document.body.appendChild(textArea);

      // Select the text
      textArea.select();
      textArea.setSelectionRange(0, 99999); // For mobile devices

      // Execute the copy command
      document.execCommand("copy");

      // Remove the temporary input
      document.body.removeChild(textArea);

      setCopied(true);
    } finally {
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    }
  };


  return (
    <button
      className="ml-2 p-1 bg-gray-700 text-white text-xs rounded-lg hover:bg-gray-600 transition"
      onClick={handleCopyClick}
    >
      {copied ? "Copied!" : "Copy Link"}
    </button>
  );
};

const Production = () => {
  const mines = useCommonStore((state) => state.mines);
  const availableMines = useCommonStore((state) => state.availableMines);
  const { t } = useTranslation();
  const cloudStorage = useCloudStorage();
  const [userId, setUserId] = useState<string | null>(null);

  // Получаем userId из cloudStorage
  useEffect(() => {
    cloudStorage.get("userId").then((storedUserId) => {
      if (storedUserId) {
        setUserId(storedUserId);
        console.log("userId from cloudStorage: ", storedUserId);
      } else {
        console.log("userId not found in cloudStorage.");
      }
    });
  }, [cloudStorage]);

  const referralLink = `https://t.me/miracleGameBot?startapp=${userId}`;

  return (
    <div className="flex flex-col gap-4 p-5">
      {/* Helpful Links */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl text-white mb-3">{t("Helpful Links")}</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <img src={telegram_icon} className="w-10 h-10" alt="icon" />
            <div className="ml-3">
              <Link to="https://t.me/MiracleGame_Channel" className="text-white text-lg">
                Main Channel
              </Link>
              <p className="text-gray-400 text-sm">{t("In this channel you can find out news about changes in prices for setting items")}</p>
            </div>
          </div>
          <div className="flex items-start">
            <img src={alpha_icon} className="w-10 h-10" alt="icon" />
            <div className="ml-3">
              <Link to="https://t.me/MiracleGame_Chat" className="text-white text-lg">
                Alpha Channel
              </Link>
              <p className="text-gray-400 text-sm">{t("Insider channel that only the first 1000 players can join")}</p>
            </div>
          </div>
          {/* Add other links similarly */}
        </div>
      </div>

      {/* Friends Block */}
<div className="bg-gray-800 p-4 rounded-lg">
  <h2 className="text-xl text-white mb-3">{t("Friends")}</h2>
  <div>
    {mines && Object.keys(mines).length > 0 ? (
      Object.values(mines)
        .filter((mine) => {
          const resource = availableMines.find(
            (m) => m.resource.id === mine?.id
          );
          return resource && resource.resource.id === "uranus";
        })
        .map((mine) => {
          const resource = availableMines.find(
            (m) => m.resource.id === mine?.id
          );

          return mine && resource ? (
            <Link to={`/mine/${mine.id}`} key={mine.id}>
              <div className="w-full flex relative bg-gray-700 rounded-lg p-3 mb-2">
                <img
                  className="absolute w-full h-full z-0"
                  src={background}
                  alt="background"
                />
                <img
                  className="w-20 h-20 z-10"
                  src={resource.resource.image}
                  alt="uranus"
                />
                <div className="flex-grow flex justify-between relative">
                  <div className="flex flex-col text-sm">
                    <span className="text-gray-400 capitalize">
                      {t("factory")}
                    </span>
                    <span className="text-white capitalize">
                      {t(resource.resource.id)}
                    </span>
                    <div className="flex text-xs gap-2 mt-1">
                      <span className="text-green-500">
                        +{abbreviateNumber(mine.passive.craftPerMinute)}
                      </span>
                      <span className="text-red-500">
                        -{abbreviateNumber(mine.usagePerMinute)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-gray-400">Stock</span>
                    <span className="text-white">
                      {abbreviateNumber(mine.store.count)}
                    </span>
                    <span className="text-xs text-gray-400">
                      max. x{abbreviateNumber(mine.maxStore)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ) : null;
        })
    ) : (
      <div className="w-full flex relative bg-gray-700 rounded-lg p-3 mb-2">
        <img
          className="absolute w-full h-full z-0"
          src={background}
          alt="background"
        />
        <img
          className="w-20 h-20 z-10"
          src={uranusIcon} // Replace with Uranus icon
          alt="uranus"
        />
        <div className="flex-grow flex justify-between relative">
          <div className="flex flex-col text-sm">
            <span className="text-gray-400 capitalize">{t("Factory")}</span>
            <span className="text-white capitalize">{t("Uranus")}</span>
            <div className="flex text-xs gap-2 mt-1">
              <span className="text-gray-400">{t("Price")}: 1 {t("invite")}</span>
            </div>
          </div>
        </div>
      </div>
    )}
        </div>
      </div>

      {/* Workers Block */}
      <div className="bg-gray-800 p-4 rounded-lg text-center">
        <h2 className="text-xl text-white mb-3">{t("Workers")}</h2>
        <p className="text-white mb-4">{t("Invite 1 friend to unlock the uranium mine")}</p>
        <img src={workers_frame} alt="Invite" className="w-20 h-20 mx-auto" />
      </div>

      {/* Invite Friends Button */}
    <InviteButton referralLink={referralLink}
    />
    <CopyReferralButton referralLink={referralLink} />
    </div>
  );
};

export default Production;

