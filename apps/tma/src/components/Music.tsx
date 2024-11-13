import { useEffect } from "react";
import { useCommonStore } from "./StoreContext";

const music = new Audio("/assets/sound/music/ambient.ogg");
music.loop = true;
let musicStarted = false;

export const Music = () => {
  const onMusic = useCommonStore((state) => state.onMusic);
  console.log(onMusic);

  useEffect(() => {
    if (onMusic) {
      music.play().then(() => {
        musicStarted = true;
      });
    }
    return () => {
      if (music && musicStarted) {
        music.pause();
        musicStarted = false;
      }
    };
  }, [onMusic]);

  return null;
};
