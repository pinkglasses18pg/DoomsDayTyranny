import { useTonConnectUI } from "@tonconnect/ui-react";
import { FC, useState, useEffect } from "react";
import buttonImg from "@/assets/button_ivent_white_big.svg";
import { useCloudStorage } from "@tma.js/sdk-react";

const TonWalletButton: FC = () => {
    const [tonConnectUI] = useTonConnectUI();
    const [walletConnected, setWalletConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const cloudStorage = useCloudStorage();


    useEffect(() => {
        // Fetch username from cloud storage on component mount
        cloudStorage.get("username").then((storedUsername) => {
            if (storedUsername) {
                setUsername(storedUsername as string);
            }
        });

        // Check the initial wallet connection status
        if (tonConnectUI.wallet) {
            const walletInfo = tonConnectUI.wallet;
            console.log("Wallet is already connected:", walletInfo);
            setWalletConnected(true);
            setWalletAddress(walletInfo.account?.address || null);
        }

        const unsubscribe = tonConnectUI.onStatusChange((walletInfo) => {
            console.log("Wallet status changed:", walletInfo);
            setWalletConnected(!!walletInfo);
            setWalletAddress(walletInfo?.account?.address || null);
        });

        // Log the current wallet info
        console.log("Initial wallet status:", tonConnectUI.wallet);

        return () => unsubscribe();
    }, [tonConnectUI, cloudStorage]);

    const handleConnectClick = async () => {
        if (walletConnected) {
            console.log("Disconnecting wallet...");
            tonConnectUI.disconnect();
            setWalletAddress(null);
            setWalletConnected(false);
            console.log("Wallet disconnected.");
        } else {
            try {
                console.log("Opening wallet connection modal...");
                if (!tonConnectUI.wallet) {
                    await tonConnectUI.openModal();
                    console.log("Modal opened successfully.");
                } else {
                    console.log("Wallet already connected.");
                }
            } catch (error) {
                console.error("Failed to connect wallet:", error);
                alert("Ошибка подключения кошелька. Проверьте настройки манифеста.");
            }
        }
    };

    const formatAddress = (address: string) =>
        `${address.slice(0, 5)}...${address.slice(-5)}`; // Shorten the address

    return (
        <div className="ton-wallet-button" style={{ textAlign: "center" }}>
            {walletConnected && walletAddress && (
                <p
                    style={{
                        marginTop: "10px",
                        color: "#fff",
                        fontSize: "14px",
                        textAlign: "center",
                        wordWrap: "break-word",
                    }}
                >
                    {formatAddress(walletAddress)}
                </p>
            )}
            <button
                onClick={handleConnectClick}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    position: "relative",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                }}
            >
                <img
                    src={buttonImg}
                    alt={walletConnected ? "Disconnect Wallet" : "Connect Wallet"}
                    style={{
                        width: "100%",
                        opacity: walletConnected ? 0.5 : 1,
                        transition: "opacity 0.3s",
                    }}
                />
                {/* Text Overlay */}
                <span
                    style={{
                        position: "absolute",
                        top: "50%", // Vertically center the text
                        left: "50%", // Horizontally center the text
                        transform: "translate(-50%, -50%)", // Centering trick
                        color: walletConnected ? "#fff" : "#000",
                        fontWeight: "bold",
                        fontSize: "16px",
                        textAlign: "center",
                        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)", // Add subtle shadow for readability
                        pointerEvents: "none", // Make the text unclickable
                    }}
                >
                    {walletConnected ? "Disconnect TON Wallet" : "Connect TON Wallet"}
                </span>
            </button>

            {/* Display Username Below the Button */}
            {username && (
                <p
                    style={{
                        marginTop: "10px",
                        color: "#ccc",
                        fontSize: "14px",
                        textAlign: "center",
                    }}
                >
                    {username}
                </p>
            )}
        </div>
    );
};

export default TonWalletButton;

