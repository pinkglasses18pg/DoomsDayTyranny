// apps/tma/src/components/Tutor.tsx

import tutor1 from "@/assets/tutor/tutor1.png";
import tutor2 from "@/assets/tutor/tutor2.png";
import tutor3 from "@/assets/tutor/tutor3.png";
import tutor4 from "@/assets/tutor/tutor4.png";
import tutorRu1 from "@/assets/tutorRU/tutor1RU.png";
import tutorRu2 from "@/assets/tutorRU/tutor2RU.png";
import tutorRu3 from "@/assets/tutorRU/tutor3RU.png";
import tutorRu4 from "@/assets/tutorRU/tutor4RU.png";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRef } from 'react';
import {useCommonStore} from "@/components/StoreContext.tsx";

const enImages: string[] = [tutor1, tutor2, tutor3, tutor4];
const ruImages: string[] = [tutorRu1, tutorRu2, tutorRu3, tutorRu4];

export const Tutor = () => {
  const { i18n } = useTranslation();
  const [images, setImage] = useState<string[]>([]);

  const [currentIndex, setCurrentIndex] = useState(-1);

  const [tutorialShown, setTutorialShown] = useState(false);

  const initState = useCommonStore((state) => state.initState);
  const setAppState = useCommonStore((state) => state.setAppState);


  const tutorialShownRef = useRef(tutorialShown);

useEffect(() => {
  tutorialShownRef.current = tutorialShown; // Обновляем реф при изменении состояния
}, [tutorialShown]);

    useEffect(() => {
        console.log("initApp from tutor.tsx : ", initState);

        if (initState === "langSetted" &&
            !tutorialShownRef.current ) {
            if (i18n.language === "ru") {
                setImage(ruImages);
            } else {
                setImage(enImages);
            }
            if(!tutorialShownRef.current) {
                setCurrentIndex(0);
                setTutorialShown(true);
            }
        }

    }, [initState, i18n.language]);

  const handleClick = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(-1);
      setAppState({initState: "done"});
      setTutorialShown(false);
    }
  };

  return currentIndex > -1 ? (
    <>
      <div className="absolute w-screen h-screen bg-darkM z-20"></div>
      <img
        src={images[currentIndex]}
        alt={`Image ${currentIndex + 1}`}
        onClick={handleClick}
        className="absolute cursor-pointer w-full h-full object-contain z-50"
      />
    </>
  ) : null;
};
