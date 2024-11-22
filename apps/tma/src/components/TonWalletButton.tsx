import { useTonConnectUI } from "@tonconnect/ui-react";
import { FC, useState, useEffect } from "react";

const TonWalletButton: FC = () => {
    const [tonConnectUI] = useTonConnectUI();
    const [walletConnected, setWalletConnected] = useState(false);

    useEffect(() => {
        const unsubscribe = tonConnectUI.onStatusChange((walletInfo) => {
            console.log("Wallet status changed:", walletInfo);
            setWalletConnected(!!walletInfo);
        });

        // Log the current wallet info
        console.log("Initial wallet status:", tonConnectUI.wallet);

        return () => unsubscribe();
    }, [tonConnectUI]);

    const handleConnectClick = async () => {
        if (walletConnected) {
            console.log("Disconnecting wallet...");
            // Handle wallet change or disconnect
            tonConnectUI.disconnect();
            setWalletConnected(false);
            console.log("Wallet disconnected.");
        } else {
            console.log("Opening wallet connection modal...");
            // Show the wallet connection modal
            try {
                // Open the modal for wallet connection
                await tonConnectUI.openModal();
                console.log("Modal opened successfully.");
            } catch (error) {
                console.error("Failed to connect wallet:", error);
                alert("Ошибка подключения кошелька. Проверьте настройки манифеста.");
            }
        }
    };

    return (
        <button onClick={handleConnectClick}>
            {walletConnected ? "Change TON Wallet" : "Connect TON Wallet"}
        </button>
    );
};

export default TonWalletButton;
