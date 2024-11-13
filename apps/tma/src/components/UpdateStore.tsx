import { useCommonStore } from "./StoreContext";

let lastUpdateTime = 0;
const updateInterval = 100;

export const UpdateStore = () => {
  const tick = useCommonStore((state) => state.tick);

  function update(time: number) {
    let deltaTime = time - lastUpdateTime;
    while (deltaTime >= updateInterval) {
      tick();
      deltaTime -= updateInterval;
      lastUpdateTime += updateInterval;
    }
    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);

  return null;
};
