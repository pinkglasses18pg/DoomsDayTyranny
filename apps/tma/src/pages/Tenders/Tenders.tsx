import { useTranslation } from "react-i18next";
import background from "@/assets/icons/background.svg";
import telescop from "@/assets/telescop.jpg";
import superComputer from "@/assets/superComputer.jpg";
import bilboard from "@/assets/bilboard.jpg";

const Tenders = () => {
  const { t } = useTranslation();

  return (
    <div className="size-full flex flex-col gap-2.5">
      <div className="relative h-24 w-full flex justify-center items-center">
        <span>{t("noInvitations")}</span>

        <div className="border-t-2 border-darkGrayM absolute bottom-2 left-0 w-full"></div>
        <div className="border-t-2 border-darkGrayM/50 absolute bottom-0 left-0 w-full"></div>
      </div>

      <div className="flex-grow w-full flex flex-col opacity-60 gap-1">
        {[
          { image: bilboard, id: 1, text: "digitalBillboard", price: 500 },
          { image: telescop, id: 2, text: "telescop", price: 1000 },
          { image: superComputer, id: 3, text: "supercomputer", price: 1500 },
        ].map(({ image, id, text, price }) => (
          <div className="w-full flex relative" key={id}>
            <img className="absolute w-full h-full z-0" src={background} />
            <img className="w-20 h-20" src={image} />
            <div className="flex flex-grow justify-between relative py-2 pl-4 pr-3">
              <div className="flex flex-col text-2xs gap-1">
                <span className="text-xs text-darkGrayM capitalize">
                  {t("megaproject")}:
                </span>
                <span className="text-white text-xl">{t(text)}</span>
              </div>

              <div className="flex flex-col items-end justify-between">
                <span className="text-2xs text-grayM">Reward</span>
                <span className="text-primaryM text-xl text-bold">
                  {price} M
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs text-darkGrayM pb-4 px-5 text-center flex flex-col gap-3">
        <span>{t("megaprojectDescription1")}</span>
        <span>{t("megaprojectDescription2")}</span>
      </div>
    </div>
  );
};

export default Tenders;
