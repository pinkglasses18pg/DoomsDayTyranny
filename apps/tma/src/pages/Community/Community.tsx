// apps/tma/src/pages/Community/Community.tsx

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

const InviteButton = ({
  referralLink,
}: {
  referralLink: string;
}) => {
  const [shared, setShared] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
      const intervalId = setInterval(() => {
      if (shared) {
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
        await Telegram.WebApp.openTelegramLink(telegramShareUrl);
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
            {shared ? "Link Shared!" : t("inviteFriends")}
          </span>
        </div>
      </Button>
    </div>
  );
};


const CopyReferralButton = ({ referralLink }: { referralLink: string }) => {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

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
      className="ml-2 p-1 bg-gray-700 text-white text-xs rounded-lg hover:bg-gray-600"
      onClick={handleCopyClick}
    >
      {copied ? t("copied") : t("copyLink")}
    </button>
  );
};

const Production = () => {
  const mines = useCommonStore((state) => state.mines);
  const availableMines = useCommonStore((state) => state.availableMines);
  const { t } = useTranslation();
  const cloudStorage = useCloudStorage();
  const [userId, setUserId] = useState<string | null>(null);
  const [referrals, setReferrals] = useState<string[]>([]);

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

  useEffect(() => {
    const fetchReferrals = async () => {
      const storedReferrals = await cloudStorage.get("referrals");
      const existingReferrals = storedReferrals ? JSON.parse(storedReferrals) : [];
      setReferrals(existingReferrals || []);
    };

    fetchReferrals();
  }, [cloudStorage]);

  const referralLink = `https://t.me/DoomsDayTyrannybot?startapp=${userId}`;

  console.log("mines:", mines);
  console.log("availableMines:", availableMines);

  return (
      <div className="flex flex-col gap-4 p-5">
        {/* Helpful Links */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl text-white mb-3">{t("helpfulLinks")}</h2>
          <div className="space-y-4">
            <Link to="https://t.me/DoomsdayTyranny" className="text-white text-lg">
              <div className="flex items-start">
                <img src={telegram_icon} className="w-10 h-10" alt="icon"/>
                <div className="ml-3">

                  {t("mainChannel")}

                  <p className="text-gray-400 text-sm">{t("mainChannelDescription")}</p>
                </div>
              </div>
            </Link>
            <Link to="https://t.me/+RC89TpkfIYVhNDUy" className="text-white text-lg">
              <div className="flex items-start">
                <img src={alpha_icon} className="w-10 h-10" alt="icon"/>
                <div className="ml-3">

                  {t("alphaChannel")}

                  <p className="text-gray-400 text-sm">{t("alphaChannelDescription")}</p>
                </div>
              </div>
            </Link>
            {/* Add other links similarly */}
          </div>
        </div>

        {/* Friends Block */}

        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl text-white mb-3">{t("Friends")}</h2>
          <div>
            {availableMines.some((m) => m.resource.id === "uranus") ? (
                <div className="w-full flex relative bg-gray-700 rounded-lg p-3 mb-2">
                  <img
                      className="absolute w-full h-full z-0"
                      src={background}
                      alt="background"
                  />
                  <img
                      className="w-20 h-20 z-10 mr-4"
                      src={uranusIcon} // Uranus icon
                      alt="uranus"
                  />
                  <div className="flex-grow flex justify-between relative">
                    <div className="flex flex-col text-sm">
                      <span className="text-gray-400 capitalize">{t("Factory")}</span>
                      <span className="text-white capitalize">{t("Uranus")}</span>
                      <div className="flex text-xs gap-2 mt-1">
                        {mines["uranus"] ? (
                            <>
                  <span className="text-green-500">
                    +{abbreviateNumber(mines["uranus"].passive.craftPerMinute)}
                  </span>
                              <span className="text-red-500">
                    -{abbreviateNumber(mines["uranus"].usagePerMinute)}
                  </span>
                            </>
                        ) : (
                            <span className="text-gray-400">
                   {t("invite")}
                </span>
                        )}
                      </div>
                    </div>
                    {mines["uranus"] && (
                        <div className="flex flex-col items-end">
                          <span className="text-gray-400">{t("Stock")}</span>
                          <span className="text-white">
                {abbreviateNumber(mines["uranus"].store.count)}
              </span>
                          <span className="text-xs text-gray-400">
                max. x{abbreviateNumber(mines["uranus"].maxStore)}
              </span>
                        </div>
                    )}
                  </div>
                  {referrals.length > 0 ? (
                      <Link
                          to={`/mine/uranus`}
                          className="absolute inset-0 z-20"
                          style={{ textDecoration: "none" }}
                      />
                  ) : null}
                </div>
            ) : (
                <p className="text-gray-400">{t("dontHaveUranus")}</p>
            )}
          </div>
        </div>

        {/* Workers Block */}
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <h2 className="text-xl text-white mb-3">{t("meatballs")}</h2>
          {referrals.length > 0 ? (
              <div className="mt-4 text-white">
                <ul className="text-sm">
                  {referrals.map((referral, index) => (
                      <li key={index} className="mb-1">
                        {referral}
                      </li>
                  ))}
                </ul>
              </div>
          ) : (
              <div>
                <p className="text-white mb-4">{t("inviteFriendReward")}</p>
                <img src={workers_frame} alt="Invite" className="w-20 h-20 mx-auto"/>
              </div>
          )}
        </div>

        {/* Invite Friends Button */
        }

          <InviteButton referralLink={referralLink}
          />
          <CopyReferralButton referralLink={referralLink}/>
        </div>
        );
        };

        export default Production;

