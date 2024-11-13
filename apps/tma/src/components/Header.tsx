// apps/tma/src/components/Header.tsx

import { useState } from "react";
import { Button } from "@headlessui/react";
import burger from "@/assets/icons/burger.svg";
import chip from "@/assets/icons/chip.svg";
import soft from "@/assets/icons/icon_soft.svg";
import hard from "@/assets/icons/hard.svg";
import plus from "@/assets/icons/plus.svg";
import { abbreviateNumber, abbreviateBytes } from "@/pages/utils";
import Drawer from "./Drawer";
import lock from "@/assets/icons/lock.svg";
import { industries } from "./industries";
import settings from "@/assets/icons/settings.svg";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCommonStore } from "./StoreContext";

export const Header = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const coin = useCommonStore((state) => state.coin);
  const mCoin = useCommonStore((state) => state.mCoin);
  const mines = useCommonStore((state) => state.mines);
  // const initState = useCommonStore((state) => state.initState);
  const { t } = useTranslation();
  const initState = useCommonStore((state) => state.initState);
  const setAppState = useCommonStore((state) => state.setAppState);

  const toggleDrawer = () => {
    setDrawerOpen((x) => !x);
  };


  const onClickTutorial = () => {
      // console.log("HEADER LOGS :: Tutorial button clicked");
        console.log("HEADER LOGS :: Stored value for 'initApp' before type button in settings:", initState);
        setAppState({ initState: "langSetted" });

    //cloudStorage.delete("tutor");
  };

  return (
    <div className="flex w-full py-3 px-6 gap-1 justify-between items-center bg-grayBGM">
      <Drawer isOpen={isDrawerOpen} onClose={toggleDrawer}>
        <div className="h-28 w-full"></div>

        <div className="w-full flex-grow divide-y-2 divide-darkGrayM/50">
          {industries.map((item, index) => (
            <div
              key={item.name}
              className={`flex w-full items-center py-2.5 ${index === 0 ? "bg-grayM" : "bg-black"}`}
            >
              <img src={item.icon} className="w-7 h-7 ml-5" />
              <div
                className={`flex flex-col flex-grow pl-3.5 ${index === 0 ? "" : "text-white"}`}
              >
                <span className="text-sm text-bold">{t(item.name)}</span>
                <span className="text-2xs">
                  {t("factory")} {index === 0 ? Object.keys(mines).length : 0}
                </span>
              </div>
              {index === 0 ? null : <img className="mr-9" src={lock}></img>}
            </div>
          ))}
        </div>

        <div className="flex flex-col w-full mb-6 divide-y-2 divide-darkM">
          <Link to="/settings">
            <Button className="flex w-full items-center pl-6 py-2 bg-darkGrayM/5">
              <img src={settings} className="w-6 h-6" />
              <span className="ml-4 text-white">{t("gameSettings")}</span>
            </Button>
          </Link>

          <Button
            onClick={onClickTutorial}
            className="flex w-full items-center pl-6 py-2 bg-darkGrayM/5"
          >
            <span className="text-white text-bold text-3xl">?</span>
            <span className="ml-5 text-white">{t("tutorial")}</span>
          </Button>
        </div>industries
      </Drawer>

      <Button onClick={toggleDrawer}>
        <img src={burger} className="w-7 h-7" />
      </Button>

      <div className="flex items-center">
        <img src={chip} className="w-5 h-5" />

        <div className="flex flex-col px-1 text-darkGrayM -ml-px bg-grayBGM">
          <span className="text-4xs">{t("industry")}:</span>
          <span className="text-3xs">{t("electronics")}</span>
        </div>
      </div>

      <div className="flex flex-grow items-center text-whiteM bg-darkM py-2.5 px-1">
        <img className="h-4 w-4" src={soft} />
        <span className="text-xs font-bold flex-grow text-center">
          {abbreviateBytes(coin)}
        </span>
      </div>

      <div className="flex flex-grow items-center bg-darkM py-2.5 px-1 gap-1">
        <img className="w-5 h-4" src={hard} />
        <span className="flex-grow text-primaryM text-xs font-bold text-center">
          {abbreviateNumber(mCoin)}
        </span>

        <Button className="w-4 h-4">
          <img src={plus} />
        </Button>
      </div>
    </div>
  );
};
