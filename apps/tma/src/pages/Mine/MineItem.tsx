// apps/tma/src/pages/Mine/MineItem.tsx

import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { ConfigItem } from "@/store/types";
import { Button } from "@headlessui/react";
import { MineHeader } from "./MineHeader";
import { MineUpgrade } from "./MineUpgrade";
import { MineInfo } from "./MineInfo";
import hardIcon from "@/assets/icons/hard.svg";
import { abbreviateBytes } from "../utils";
import lines from "@/assets/lines.svg";
import { isImpossibleSell } from "@/store/gameSlice";
import { MineStore } from "./MineStore";
import { useTranslation } from "react-i18next";
import { useSound } from "@/components/sound";
import { useCommonStore } from "@/components/StoreContext";

const ProductionItem = () => {
  const { mine } = useParams();
  const mines = useCommonStore((state) => state.mines);
  const availableMines = useCommonStore((state) => state.availableMines);

  if (!mine) {
    return <p className="text-white">Not Found</p>;
  }
  // Мемоизация поиска mineInstance
  const mineInstance = useMemo(() => {
    return mine ? availableMines.find((m) => m.resource.id === mine) : undefined;
  }, [availableMines, mine]);

  // Мемоизация определения, куплена ли шахта
  const isBought = useMemo(() => {
    return mine ? mines[mine] !== undefined : false;
  }, [mine, mines]);

  if (mineInstance === undefined) {
    return <p className="text-white">Not Found</p>;
  }

  return <BaseProduction resource={mineInstance} isBought={isBought} />;
};

const BaseProduction = React.memo(({
  resource,
  isBought,
}: {
  resource: ConfigItem;
  isBought: boolean;
}) => {
  const sellPrice = resource.sellPrice;
  return (
    <div className="flex flex-col h-full w-full text-gray-200 items-center">
      <MineHeader resourceId={resource.resource.id} />

      <MineUpgrade resource={resource} disabled={!isBought} />

      <MineStore resourceId={resource.resource.id} />

      <MineInfo resource={resource} />

      {sellPrice > 0 && (isBought ? <SellAll resource={resource} /> : <BuyMine mine={resource} />)}
    </div>
  );
});

const BuyMine = React.memo(({ mine }: { mine: ConfigItem }) => {
  const { t } = useTranslation();
  const soundInstance = useSound("buyFabric");
  const mines = useCommonStore((state) => state.mines);
  const coin = useCommonStore((state) => state.coin);
  const buyMine = useCommonStore((state) => state.buyMine);
  const buyThisMyne = React.useCallback(() => {
    buyMine(mine.resource.id);
    soundInstance?.play();
  }, [buyMine, mine.resource.id, soundInstance]);

  const disabled = !!mines[mine.resource.id] || coin < mine.unlockPrice;

  return (
    <ActionButton
      isMiracleCoin={false}
      disabled={disabled}
      onClick={buyThisMyne}
      label={t("buy")}
      price={abbreviateBytes(mine.unlockPrice)}
    />
  );
});

const SellAll = React.memo(({ resource }: { resource: ConfigItem }) => {
  const { t } = useTranslation();
  const soundInstance = useSound("sellResurce");
  const sellStore = useCommonStore((state) => state.sellStore);
  const mine = useCommonStore((state) => state.mines[resource.resource.id]);
  const sellprice = resource.sellPrice;
  console.log("sellPrice = ", sellprice);

  if (mine === undefined) return null;

  const sellAll = () => {
    sellStore(resource.resource.id);
    soundInstance?.play();
  };



  return (
    <ActionButton
      isMiracleCoin={resource.sellIsMiriclaCoint}
      disabled={isImpossibleSell(mine) || sellprice === 0}
      onClick={sellAll}
      label={t("sell")}
      price={`+${abbreviateBytes(mine.store.count * resource.sellPrice)}`}
    />
  );
});

const ActionButton = React.memo(({
  isMiracleCoin,
  disabled,
  onClick,
  label,
  price,
}: {
  isMiracleCoin: boolean;
  disabled: boolean;
  onClick: () => void;
  label: string;
  price: string;
}) => (
  <Button
    disabled={disabled}
    onClick={onClick}
    className={`relative w-72 
    ${
      isMiracleCoin
        ? "bg-primaryM/35 text-darkM disabled:opacity-50 active:bg-primary-800 active:text-gray-200"
        : "bg-grayM text-darkM disabled:bg-gray-600 disabled:text-gray-200 active:bg-gray-800 active:text-gray-200 "
    }
    clip-down flex mt-4 `}
  >
    <img src={lines} className="absolute w-full h-full z-10" />

    <span
      className={`text-3xl ${isMiracleCoin ? "bg-primaryM" : " bg-white"} font-black clip-down text-darkM px-5 py-4`}
    >
      <span className="drop-shadow-m z-20">{label}</span>
    </span>
    <div
      className={`flex items-center font-black ${isMiracleCoin ? "text-primaryM" : "text-white"} h-full w-full align-center justify-center gap-1 z-20`}
    >
      <span className="text-2xl">{price}</span>
      {isMiracleCoin && <img src={hardIcon} className="w-6 h-6" />}
    </div>
  </Button>
));

export default ProductionItem;
