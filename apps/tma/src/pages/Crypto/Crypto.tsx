// apps/tma/src/pages/Crypto/Crypto.tsx

import React from "react";
import { useTranslation } from "react-i18next";
import TonWalletButton from "@/components/TonWalletButton";
import { useTonConnectUI } from "@tonconnect/ui-react";
import {useCommonStore} from "@/components/StoreContext.tsx";
//import offer_icon from "@assets/offer.svg";

const CryptoPage: React.FC = () => {
    const [tonConnectUI] = useTonConnectUI();
    const mCoin = useCommonStore((state) => state.mCoin);
    const coin = useCommonStore((state) => state.coin);
    const increaseMCoin = useCommonStore((state) => state.setMCoin);
    const setMCoin = useCommonStore((state) => state.setMCoin);
    const increaseCoin = useCommonStore((state) => state.setCoin);
    const { t } = useTranslation();


    // Offer details
    const offers = [
        { id: 1, imgSrc: "/offers/offer1.png", alt: "Offer 1", amount: 1, ddt: 100 },
        { id: 2, imgSrc: "/offers/offer2.png", alt: "Offer 2", amount: 1, ddt: 400 },
        { id: 3, imgSrc: "/offers/offer3.png", alt: "Offer 3", amount: 1, ddt: 1500 },
    ];



    const handleTransaction = async (offerAmount: number, ddt: number) => {
        if (!tonConnectUI.wallet) {
            alert("Please connect your TON wallet first.");
            return;
        }

        const receiverAddress = "UQC2XMAHc6XwLvx0t72LXvX3qHxXhdsB-51HYSEVdqg4FEjd";

        try {
            const transactionPayload = {
                validUntil: Math.floor(Date.now() / 1000) + 60, // Valid for 60 seconds
                messages: [
                    {
                        address: receiverAddress, // Address to send stars
                        amount: "100000000", // Convert stars to nanotons
                    },
                ],
            };

            console.log("transactionPayload : ", transactionPayload );

            await tonConnectUI.sendTransaction(transactionPayload);
            alert(`Purchase successful! ${offerAmount} Ton.`);

            // Increase user's mCoin state
            increaseMCoin(mCoin + ddt);

        } catch (error) {
            console.error("Transaction failed:", error);
            alert("Transaction failed. Please try again.");
        }
    };

    const handleExchange = () => {
        const exchangeRate = 1; // 1 DDT = 1 Coin

        if (mCoin >= exchangeRate) {
            // Deduct 1 DDT and add 1 Coin
            setMCoin(mCoin - exchangeRate);
            increaseCoin(coin + 1073741824);
            alert(`Exchange successful! 1 DDT exchanged for 1 Coin.`);
        } else {
            alert(`Not enough DDT to exchange. You need at least 1 DDT.`);
        }
    };

    return (
        <div className="flex flex-col h-screen w-full bg-darkM text-white p-1">
            {/* Buy Coin Section */}
            <div className="flex flex-col flex-shrink-0">
                <h2 className="text-lg font-bold mb-0">{t("buyCoin")}</h2>
                <hr className="border-t border-gray-600 mb-0" />
                <div className="flex flex-col gap-0">
                    {offers.map((offer) => (
                        <div key={offer.id} className="flex items-center justify-center">
                            <button
                                key={offer.id}
                                onClick={() => handleTransaction(offer.amount, offer.ddt)}
                                className="flex items-center justify-center text-white rounded-md shadow-md p-1"
                            >
                                <img
                                    className="h-16 w-full object-center rounded-md shadow-md"
                                    src={offer.imgSrc}
                                    alt={offer.alt}
                                />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Currency Exchange */}
            <div className="flex flex-col flex-shrink-0 mt-0">
                <h2 className="text-lg font-bold mb-0">{t("currencyExchange")}</h2>
                <hr className="border-t border-gray-600 mb-0" />
                <div className="flex justify-between rounded-md p-1 shadow-md">
                    <img
                        className="relative w-50 h-16 text-sm font-bold"
                        src = "assets/exchange_icon.svg"
                    />
                    <button className="relative w-44 h-16 flex items-center justify-center"
                    onClick={handleExchange}>
                        <img src="assets/exchange_button.svg" alt="Exchange Button"
                             className="absolute w-full h-full"/>
                        <span className="relative text-black font-bold">{t("exchange")}</span>
                    </button>
                </div>
            </div>

            {/* Wheel of Fortune */}
            <div className="flex flex-col flex-shrink-0 mt-0">
                <h2 className="text-lg font-bold mb-1">{t("wheelOfFortune")}</h2>
                <hr className="border-t border-gray-600 mb-0" />
                <div className="flex items-center justify-center rounded-md p-1 shadow-md">
                    <img
                        src="/assets/WheelsOfFortune.svg"
                        alt="Wheel of Fortune"
                        className="w-full max-w-md"
                    />
                </div>
            </div>

            {/* Connect TON Wallet */}
            <div className="flex flex-col flex-grow items-center justify-center mt-0 p-1">
                <hr className="w-full border-gray-600 mb-0"/>
                <TonWalletButton />

            </div>
        </div>
    );
};

export default CryptoPage;
