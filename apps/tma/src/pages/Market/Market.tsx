import { Link } from "react-router-dom";
import { abbreviateBytes } from "../utils";
import { useTranslation } from "react-i18next";
import { useCommonStore } from "@/components/StoreContext";

const Market = () => {
  const availableMines = useCommonStore((state) => state.availableMines);
  const mines = useCommonStore((state) => state.mines);
  const { t } = useTranslation();

  console.log("LOGS MARKET :: availableMines : ", availableMines);
  console.log("LOGS MARKET :: mines : ", mines);
  return (
    <div className="flex flex-col pb-8 gap-2">
      {availableMines
        .filter((mine) => !mines[mine.resource.id] && !mine.itReferalRecurce)
        .map((mine) => {
          return (
            <Link
              key={mine.resource.id}
              to={`/mine/${mine.resource.id}`}
              className="grid grid-cols-market-items"
            >
              <img className="h-full w-full z-10" src={mine.resource.image} />
              <div className="flex flex-col justify-center gap-3 px-2.5">
                <span className="text-2xs text-darkGrayM">{t("factory")}</span>
                <span className="text-white text-xs">
                  {t(mine.resource.id)}
                </span>
              </div>
              <div className="flex flex-col justify-center items-end gap-3 px-2.5">
                <span className="text-darkGrayM text-2xs px-4">
                  {t("price")}:
                </span>
                <div className="flex gap-2">
                  <span className="text-white text-xs">
                    {abbreviateBytes(mine.unlockPrice)}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
    </div>
  );
};

export default Market;
