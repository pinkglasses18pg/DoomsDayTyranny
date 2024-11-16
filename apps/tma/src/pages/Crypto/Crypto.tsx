    // apps/tma/src/pages/Crypto/Crypto.tsx

    import React from "react";
    import { useTranslation } from "react-i18next";
    //import offer_icon from "@assets/offer.svg";

    const CryptoPage: React.FC = () => {
        const { t } = useTranslation();

        return (
            <div className="flex flex-col h-screen w-full bg-darkM text-white p-4">
                {/* Buy Coin Section */}
                <div className="flex flex-col flex-shrink-0">
                    <h2 className="text-lg font-bold mb-2">{t("Buy coin")}</h2>
                    <hr className="border-t border-gray-600 mb-2" />
                    <div className="flex flex-col gap-1">
                        {[1, 2, 3].map(() => (
                                <img
                                    className="h-16 w-full object-center"
                                    src="assets/offer2.svg"
                                    alt="Coin"

                                />
                        ))}
                    </div>
                </div>

                {/* Currency Exchange */}
                <div className="flex flex-col flex-shrink-0 mt-4">
                    <h2 className="text-lg font-bold mb-1">{t("Currency exchange")}</h2>
                    <hr className="border-t border-gray-600 mb-1" />
                    <div className="flex justify-between rounded-md p-3 shadow-md">
                        <img
                            className="relative w-50 h-16 text-sm font-bold"
                            src = "assets/exchange_icon.svg"
                        />
                        <button className="relative w-44 h-16 flex items-center justify-center"
                        onClick={() => console.log("pressed Exchange button")}>
                            <img src="assets/exchange_button.svg" alt="Exchange Button"
                                 className="absolute w-full h-full"/>
                            <span className="relative text-black font-bold">{t("Exchange")}</span>
                        </button>
                    </div>
                </div>

                {/* Wheel of Fortune */}
                <div className="flex flex-col flex-shrink-0 mt-0">
                    <h2 className="text-lg font-bold mb-1">{t("Wheel of Fortune")}</h2>
                    <hr className="border-t border-gray-600 mb-1" />
                    <div className="flex items-center justify-center rounded-md p-3 shadow-md">
                        <img
                            src="/assets/WheelsOfFortune.svg"
                            alt="Wheel of Fortune"
                            className="w-full max-w-md"
                        />
                    </div>
                </div>

                {/* Connect TON Wallet */}
                <div className="flex flex-col flex-grow items-center justify-center mt-1 bg-secondDark p-4">
                    <hr className="w-full border-gray-600 mb-1"/>
                    <button className="bg-grayM text-darkM px-6 py-3 text-lg w-full"
                            onClick={() => console.log("pressed Connect TON wallet button")}
                    >

                        <img src="assets/exchange_button.svg" alt="Connect TON wallet"
                             className="absolute w-full h-full "/>
                        <span className="relative text-black font-bold">{t("Connect TON wallet")}</span>
                    </button>
                </div>
            </div>
        );
    };

    export default CryptoPage;
