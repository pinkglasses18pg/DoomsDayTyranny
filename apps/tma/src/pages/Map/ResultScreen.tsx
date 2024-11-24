import React from 'react';
import loadIndicator from "@/assets/icons/loadder.svg";
import {useTranslation} from "react-i18next";


interface ResultScreenProps {
    isVictory: boolean;
    onAccept: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ isVictory, onAccept }) => {
    const { t } = useTranslation();

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50"
        >
            <div className="flex flex-col items-center bg-grayBGM rounded-lg shadow-lg p-6 w-[90%] max-w-[500px]">
                {/* Icon */}
                <div className="mb-6">
                    <img
                        src={isVictory ? '/assets/mapIcons/victory_icon.png' : '/assets/mapIcons/defeat_icon.svg'}
                        alt={isVictory ? 'Victory' : 'Defeat'}
                        className="w-50 h-10"
                    />
                </div>

                {/* Статичное изображение */}
                <img
                    src={loadIndicator}
                    alt="Loading..."
                    className="w-64 h-64 mb-6 object-contain"
                />

                {/* Title */}
                {/*<h1
                    className={`text-2xl font-bold ${
                        isVictory ? 'text-secondaryM' : 'text-primaryM'
                    } mb-4`}
                >
                    {isVictory ? 'VICTORY' : 'DEFEAT'}
                </h1>*/}

                {/* Message */}
                <p className="text-grayM text-center mb-6">
                    {isVictory
                        ? t("objectivesAccomplished") + " " + t("leatherBagsNotStopUs") + "\n" + t("congratulations")
                        : t("aiMistake") + "\n" + t("tryAgain")}
                </p>

                {/* Accept Button */}
                <button
                    onClick={onAccept}
                    className="px-6 py-2 bg-whiteM text-darkM font-medium rounded-md shadow-md hover:bg-grayM hover:text-whiteM"
                >
                    {t("accept")}
                </button>
            </div>
        </div>
    );
};

export default ResultScreen;
