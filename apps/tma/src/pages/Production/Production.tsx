import { Link } from "react-router-dom";
import background from "@/assets/icons/background.svg";
import { useTranslation } from "react-i18next";
import { abbreviateNumber } from "../utils";
import { useCommonStore } from "@/components/StoreContext";

const Production = () => {
  const mines = useCommonStore((state) => state.mines);
  const availableMines = useCommonStore((state) => state.availableMines);
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-0.5 pb-10">
      {mines && Object.keys(mines).length > 0
        ? Object.values(mines)
            .reverse()
            .map((mine) => {
              const resource = availableMines.find(
                (m) => m.resource.id === mine?.id
              );

              return mine && resource ? (
                <Link to={`/mine/${mine.id}`} key={mine.id}>
                  <div className="w-full flex relative">
                    <img
                      className="absolute w-full h-full z-0"
                      src={background}
                    />
                    <img
                      className="w-20 h-20 z-10"
                      src={resource.resource.image}
                    />
                    <div className="flex flex-grow justify-between relative py-3 pl-4 pr-3">
                      <div className="flex flex-col text-2xs justify-between">
                        <span className="text-xs text-grayM capitalize">
                          {t("factory")}
                        </span>
                        <span className="text-white">
                          {t(resource.resource.id)}
                        </span>
                        <div className="flex text-xs gap-2">
                          <span className="text-secondaryM">
                            +{abbreviateNumber(mine.passive.craftPerMinute)}
                          </span>
                          <span className="text-thirdlyM">
                            -{abbreviateNumber(mine.usagePerMinute)}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between">
                        <span className="text-2xs text-grayM">{t("stock")}</span>
                        <span className="text-white">
                          {abbreviateNumber(mine.store.count)}
                        </span>
                        <span className="text-white text-xs">
                          max./x{abbreviateNumber(mine.maxStore)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ) : null;
            })
        : "No mines"}
    </div>
  );
};

export default Production;
