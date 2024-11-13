// import { MineType, isPosibleCraft, userStore } from "@/store/store";
import { Link } from "react-router-dom";
import { Button } from "@headlessui/react";
import { ProgressBar } from "../Production/ProgressBar";
import { abbreviateNumber } from "../utils";
import { ConfigItem } from "@/store/types";
import { isImpossibleMine } from "@/store/gameSlice";
import { useTranslation } from "react-i18next";
import { useSound } from "@/components/sound";
import { useCommonStore } from "@/components/StoreContext";

const ResourceItem = ({
  order,
  resource,
}: {
  order?: string;
  resource: ConfigItem["resource"]["craftResource"][0];
}) => {
  if (resource === undefined) {
    return <div className={`w-14 h-14 bg-gray-900 ${order}`} />;
  }

  const link = `/mine/${resource.id}`;

  return (
    <div className={order}>
      <Link className="flex flex-col items-center" to={link}>
        <img src={resource.image} className="w-14 h-14 border-gray-600" />
        <span>{resource.count}</span>
      </Link>
    </div>
  );
};

// const Line = ({ className }: { className?: string }) => {
//   return (
//     <svg
//       preserveAspectRatio="none"
//       className={`w-full h-full text-grayM ${className}`}
//       width="100"
//       height="100"
//       viewBox="0 0 100 100"
//     >
//       <line
//         x1={50}
//         x2={50}
//         y1={0}
//         y2={100}
//         stroke="currentColor"
//         strokeWidth={1}
//       />
//     </svg>
//   );
// };

// const SecondLine = ({ className }: { className?: string }) => {
//   return (
//     <svg
//       preserveAspectRatio="none"
//       className={`w-full h-full text-grayM ${className}`}
//       width="100"
//       height="100"
//       viewBox="0 0 100 100"
//     >
//       <line
//         x1={50}
//         x2={50}
//         y1={20}
//         y2={100}
//         stroke="currentColor"
//         strokeWidth={1}
//       />
//       <line
//         x1={50}
//         x2={100}
//         y1={20}
//         y2={20}
//         stroke="currentColor"
//         strokeWidth={1}
//       />
//     </svg>
//   );
// };

export const MineInfo = ({ resource: resource }: { resource: ConfigItem }) => {
  const { t } = useTranslation();
  const soundInstance = useSound("farm");
  const mines = useCommonStore((state) => state.mines);
  const toMine = useCommonStore((state) => state.toMine);
  const toMineResource = () => {
    toMine(resource.resource.id);
    soundInstance?.play();
  };
  const mine = mines[resource.resource.id];

  return (
    <div className="grid grid-cols-item-info gap-1.5 px-8">
      <div className="flex flex-col px-4 py-2 items-center bg-grayT">
        <span className="text-2xs text-grayM">{t("cycle")}:</span>
        <span className="text-xs text-white">
          {mine
            ? mine.passive.currentProduceTime
            : resource.passive.produceTime}{" "}
          sec
        </span>
      </div>

      <Button
        onClick={toMineResource}
        disabled={!mine || isImpossibleMine(mine, resource, mines)}
        className="col-span-1 row-span-2 relative min-w-32 active:opacity-80 disabled:opacity-50"
      >
        <img
          src={resource.resource.craftImage}
          alt={`${resource.resource.name} resource`}
          className="w-full auto top-0 object-cover absolute z-10 overflow-visible"
        ></img>
        <ProgressBar
          className="w-full min-h-32 absolute top-0 z-20"
          progress={
            mine
              ? (mine.passive.progress / resource.passive.produceTime) * 100
              : 0
          }
          isMax={false}
        />
      </Button>

      <div className="flex flex-col text-secondaryM px-4 py-2 items-center bg-thirdlyT text-center min-w-24">
        <span className="text-2xs">{t("income")}:</span>
        <span className="text-xs">
          {mine ? abbreviateNumber(mine.passive.craftPerMinute) : 0} /min
        </span>
      </div>

      <div className="flex flex-col px-4 py-2 items-center bg-grayT">
        <span className="text-2xs text-grayM">{t("result")}:</span>
        <span className="text-xs text-white">
          x{mine ? abbreviateNumber(mine.passive.workerCount) : 0}
        </span>
      </div>

      <div className="flex flex-col text-thirdlyM px-4 py-2 items-center bg-primaryT">
        <span className="text-2xs">{t("expense")}:</span>
        <span className="text-xs">
          x{mine ? abbreviateNumber(mine.usagePerMinute) : 0}
        </span>
      </div>

      <div className="grid grid-cols-5 col-span-3">
        <div className="col-span-5 h-10" />
        {/* <SecondLine />
        <Line />
        <Line />
        <Line />
        <SecondLine className="-scale-x-100" /> */}
        {[...Array(5)].map((_, index) => {
          const r = resource.resource.craftResource[index];

          return <ResourceItem key={index} resource={r} />;
        })}
      </div>
    </div>
  );
};
