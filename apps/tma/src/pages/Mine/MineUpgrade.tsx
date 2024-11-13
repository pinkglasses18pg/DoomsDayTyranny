import { Button } from "@headlessui/react";
import upIcon from "@/assets/icons/up.svg";
import soft from "@/assets/icons/icon_soft.svg";
import hard from "@/assets/icons/hardBlack.svg";
import stokeIcon from "@/assets/icons/store.svg";
import toolsIcon from "@/assets/icons/tools.svg";
import workersIcon from "@/assets/icons/workers.svg";
import { abbreviateBytes } from "../utils";
import button from "@/assets/button.svg";
import buttonM from "@/assets/buttonM.svg";
import info from "@/assets/info.svg";
import {
  useImposibleHire,
  useImposibleUpdateProductivity,
  useImpossibleUpdateStore,
} from "@/store/store";
import { ConfigItem } from "@/store/types";
import { getHireWorkerCount } from "@/store/gameSlice";
import { useTranslation } from "react-i18next";
import { useSound } from "@/components/sound";
import { useCommonStore } from "@/components/StoreContext";

const UpgradeButton = ({
  price,
  onClick,
  disabled,
  isMiracleCoin,
}: {
  price: number | "N/A";
  onClick: () => void;
  disabled: boolean;
  isMiracleCoin: boolean;
}) => {
  return (
    <div className="relative">
      <img src={isMiracleCoin ? buttonM : button} className="w-full h-8" />

      <Button
        disabled={disabled}
        className="clip-down absolute top-0 flex items-center w-full h-full disabled:bg-black/50 active:bg-black/50 disabled:text-gray-200 active:text-gray-200"
        onClick={onClick}
      >
        <div className="flex h-full w-2/6 items-center justify-center pl-1">
          <img className="w-5 h-5" src={upIcon} />
        </div>

        <div className="flex flex-grow items-center">
          <span className="text-xs text-black flex-grow text-center">
            {price === "N/A" ? price : abbreviateBytes(price)}
          </span>
          <div className="py-2 pr-2">
            <img className="w-3 h-3" src={isMiracleCoin ? hard : soft} />
          </div>
        </div>
      </Button>
    </div>
  );
};

const TitleLevel = ({
  level,
  title,
  icon,
  iconAlt,
  isCount,
}: {
  level: number;
  title: string;
  icon: string;
  iconAlt: string;
  isCount: boolean;
}) => {
  return (
    <div className="relative">
      <img src={info} className="w-full h-11" />

      <div className="flex absolute top-0 w-full items-center bg-transparent p-2">
        <img alt={iconAlt} className="w-4 h-4" src={icon} />
        <div className="flex flex-col flex-grow items-center">
          <span className="text-grayM text-2xs">{title}</span>
          <span className="text-xs text-white uppercase">
            {isCount ? "" : "lvl"} {level}
          </span>
        </div>
      </div>
    </div>
  );
};

type NA = "N/A";

export const MineUpgrade = ({
  resource,
  disabled,
}: {
  resource: ConfigItem;
  disabled?: boolean;
}) => {
  const soundInstance = useSound("upgrade");
  const { t } = useTranslation();
  const { store, fabric, worker, mines } = useCommonStore((state) => ({
    fabric: state.updateSpeedProductivity,
    store: state.updateStore,
    worker: state.hireWorker,
    mines: state.mines,
  }));

  const isImposibleUpdatestore = useImpossibleUpdateStore(resource.resource.id);
  const isImposibleUpdateProductivity = useImposibleUpdateProductivity(resource.resource.id);
  const isImposibleHire = useImposibleHire(resource.resource.id);

  const mine = mines[resource.resource.id];

  const items = [
    {
      title: t("stoke"),
      level: mine ? mine.levelStore + 1 : 1,
      isCount: false,
      isMiracleCoin: resource.store.priceIsMiracleCoin,
      price:
        resource.store.updateCapacityPrice[mine?.levelStore || 0] ||
        ("N/A" as NA),
      icon: stokeIcon,
      iconAlt: "Stoke icon",
      onClick: () => {
        store(resource.resource.id);
        soundInstance?.play();
      },
      disabled: disabled || isImposibleUpdatestore,
    },
    {
      title: t("tools"),
      level: mine ? mine.passive.fabricGrade + 1 : 1,
      isCount: false,
      isMiracleCoin: resource.passive.toolPriceIsMiracleCoin,
      price:
        resource.passive.speedUpgradePrice[
          mine ? mine.passive.fabricGrade : 0
        ] || ("N/A" as NA),
      icon: toolsIcon,
      iconAlt: "Tools icon",
      onClick: () => {
        fabric(resource.resource.id);
        soundInstance?.play();
      },
      disabled: disabled || isImposibleUpdateProductivity,
    },
    {
      title: t("workers"),
      level: mine ? mine.passive.workerCount : 0,
      isCount: true,
      isMiracleCoin: resource.passive.workerPriceIsMiracleCoin,
      price:
        resource.passive.workerPrice *
        getHireWorkerCount(
          mine ? mine.passive.workerCount : 0,
          mine ? Math.ceil(mine.maxStore / resource.passive.maxWorkersStock) : 0
        ),
      icon: workersIcon,
      iconAlt: "Workers icon",
      onClick: () => {
        worker(resource.resource.id);
        soundInstance?.play();
      },
      disabled: disabled || isImposibleHire,
    },
  ];
  return (
    <div className="flex gap-1.5 px-2 w-full">
      {items.map(
        ({
          title,
          level,
          price,
          icon,
          iconAlt,
          isCount,
          isMiracleCoin,
          onClick,
          disabled,
        }) => (
          <div key={title} className="flex flex-col gap-2 flex-grow">
            <TitleLevel
              title={title}
              level={level}
              icon={icon}
              iconAlt={iconAlt}
              isCount={isCount}
            />
            <UpgradeButton
              isMiracleCoin={isMiracleCoin}
              price={price}
              onClick={onClick}
              disabled={disabled}
            />
          </div>
        )
      )}
    </div>
  );
};
