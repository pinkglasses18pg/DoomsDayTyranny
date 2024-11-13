import { useCommonStore } from "@/components/StoreContext";
import { abbreviateNumber } from "../utils";

export const MineStore = ({ resourceId }: { resourceId: string }) => {
  const mine = useCommonStore((state) => state.mines[resourceId]);
  let maxStore = 10;
  let store = 0;

  if (mine) {
    maxStore = mine.maxStore;
    store = mine.store.count;
  }

  return (
    <div className="py-8 font-black bg-gradient-to-r from-white to-darkGrayM text-transparent bg-clip-text tracking-wide">
      <span className="">x</span>
      <span className="text-2xl ">{abbreviateNumber(store)}</span>
      <span>/</span>
      <span className="text-16px">{abbreviateNumber(maxStore)}</span>
    </div>
  );
};
