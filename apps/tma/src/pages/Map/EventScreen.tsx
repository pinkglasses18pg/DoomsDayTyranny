// src/components/EventScreen.tsx

import { Link } from "react-router-dom";
import React, { useState } from 'react';
import {TileType, EventType, Mines} from "@/store/types.ts";
import ResultScreen from './ResultScreen';
import {useCommonStore} from "@/components/StoreContext.tsx";
import {useSound} from "@/components/sound.ts";
import {LoadIndicator} from "@/components/LoadIndicator.tsx";
import { abbreviateBytes } from "../utils";
import { useTranslation } from "react-i18next";

import ActivateButton from "@/assets/button_ivent_active.svg";
import InactiveButton from "@/assets/button_ivent_inactive.svg";

interface EventScreenProps {
    tile: TileType;
    event: EventType | undefined; // Include event data
    onClose: () => void;
    canCraftEvent: (requirements: { id: string; count: number }[]) => boolean;
    onCraft: (event: EventType) => void;
    mines: Mines;
    coins: number;
}

const EventScreen: React.FC<EventScreenProps> = ({
                                                     tile,
                                                     event,
                                                     onClose,
                                                     canCraftEvent,
                                                     onCraft,
                                                     mines,
                                                     coins,
                                                 }) => {
    const isCraftable = event?.craftEvent ? canCraftEvent(event.craftEvent) : false;
    const completeEvent = useCommonStore((state) => state.completeEvent);
    const incrementTileAttempts = useCommonStore((state) => state.incrementTileAttempts);
    const takeRewards = useCommonStore((state) => state.takeRewards);
    const soundInstance = useSound("fight");
    const generateEventsForMap = useCommonStore((state) => state.generateEventsForMap);
    const updateTileOwner = useCommonStore((state) => state.updateTileOwner);
    const isTileNeighborOfPlayer = useCommonStore((state) => state.isTileNeighborOfPlayer);

    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();


    // Можно ли вообще войти в событие?
    const handleCraft = () => {
        if (event && isEventAvailable(event)) {

            onCraft(event);
            const chance = calculateChance();
            const success = Math.random() * 100 < chance;
            soundInstance?.play();
            setIsLoading(true);
            setTimeout(() => {
            if (success) {
                // Complete the event
                takeRewards(event.rewards);
                completeEvent(tile.id);
                updateTileOwner(tile.id, 'player');

                console.log("Map is generated");
                generateEventsForMap(tile);
            } else {
                // Increment attempts
                incrementTileAttempts(tile.id);
            }
            setResult(success ? 'victory' : 'defeat');
            }, 2000);
        }
    };
    const [result, setResult] = useState<'victory' | 'defeat' | null>(null);

    const handleAcceptResult = () => {
        setResult(null); // Reset result
        onClose(); // Close the EventScreen
    };

    if (result) {
        return <ResultScreen isVictory={result === 'victory'} onAccept={handleAcceptResult} />;
    }


    const calculateChance = () => {
        if (!event) return 0;
        const chance = (event.difficulty.baseChance + tile.attempts * event.difficulty.tryMultiplay) * 100; // Convert to percentage
        return Math.round(chance);
    };

    const isEventAvailable =(event: EventType) => {
      return (isCraftable && coins >= event.price && isTileNeighborOfPlayer(tile.id))
    };

    const isEnoughResource = (req: any) => {
        const userResourceCount = mines[req.id]?.store.count ?? 0;
        const isEnough = userResourceCount >= req.count;
            return ( isEnough)
    };

    if (!event) {
        return (
            <div
                className="event-screen"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                }}
                onClick={onClose}
            >
                <div
                    style={{
                        backgroundColor: '#fff',
                        padding: '20px',
                        borderRadius: '8px',
                        minWidth: '300px',
                    }}
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                >
                    <h2>No event found</h2>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        );
    }

return (
    <>
        {isLoading ? (
            <LoadIndicator />
        ) : (
    <div
        className="event-screen"
        style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflowY: "auto",
            scrollBehavior: "smooth",
            zIndex: 1000,
            paddingTop: '0px', // Отступ сверху
        }}
        onClick={onClose}
    >
        <div
            className="event-content"
            style={{
                backgroundColor: "#1F1F1F",
                color: '#fff',
                padding: '20px',
                borderRadius: '12px',
                maxWidth: "600px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                position: "relative",
                marginTop: '100px',
            }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
            <img
                src={event.image}
                alt={event.name}
                style={{width: '100%', height: "auto", marginBottom: '10px', objectFit: 'contain'}}
            />
            <h2 style={{fontSize: "36px", display: "flex", alignItems: "center"}}>
                <img
                    src={event.icon}
                    alt="Icon for Name"
                    style={{width: "84px", height: "84px"}}
                />
                {t(event.name)}</h2>

            <p style={{fontSize: "14px", marginBottom: "20px"}}>{t(event.description)}</p>
            {/*<p><strong>Owner:</strong> {tile.owner}</p>*/}

            <h3>{t("need")}:</h3>
            <hr className="border-t border-gray-600 mb-0"/>
            <div className="flex flex-col flex-shrink-0 mt-0">
                <ul
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "10px", // Optional: Add some spacing between items
                        listStyleType: "none", // Remove bullet points
                        padding: 0, // Remove default padding
                        margin: 0, // Remove default margin
                    }}
                >
                    {event?.craftEvent.map((req) => (
                        <li key={req.id}>
                            < Link to={`/mine/${req.id}`} style={{
                                textDecoration: "none",
                                color: (isEnoughResource(req)) ? "#4CAF50" : "#FF4D4D"
                            }}>
                                <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                                    <img src={req.image} alt={req.id}/>
                                    <span style={{fontSize: "14px", textAlign: "center"}}>
                     {(mines[req.id]?.store.count ?? 0)}/{req.count} {/* Show available resources */}
                     </span>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <p><strong>{t("data")}:</strong></p>
            <hr className="border-t border-gray-600 mb-0"/>
            <p style={{
                textAlign: 'center',
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px"
            }}>
                <img
                    src="./assets/icons/soft.svg"
                    alt="Icon for Price"
                    style={{width: "20px", height: "20px"}}
                />
                {abbreviateBytes(event.price)} ({t("youHave")}
                <span
                    style={{
                        color: event.price <= coins ? "inherit" : "#FF4D4D", // Если недостаточно монет, текст станет красным
                    }}
                >
                {abbreviateBytes(coins)}
            </span>
                )

            </p>
            <p style={{textAlign: 'center'}}><strong>{t("chance")}:</strong> {calculateChance()}%</p>

            <button
                onClick={handleCraft}
                disabled={!isEventAvailable(event)}
                style={{
                    position: "relative", // Make the button a relative container
                    display: "inline-block", // Ensure inline-block behavior
                    border: "none", // Remove border
                    borderRadius: "8px", // Optional: Add rounded corners
                    padding: 0, // Remove padding
                    cursor: isEventAvailable(event) ? "pointer" : "not-allowed", // Set cursor style
                    background: "transparent", // No background color
                }}
            >
                <img
                    src={isEventAvailable(event) ? ActivateButton : InactiveButton}
                    style={{
                        width: "100%", // Make the image fill the button width
                        height: "100%", // Make the image fill the button height
                        objectFit: "cover", // Ensure the image covers the entire area
                        opacity: isEventAvailable(event) ? 1 : 0.5, // Adjust opacity for availability
                        transition: "opacity 0.3s", // Smooth opacity transition
                        borderRadius: "8px", // Optional: Match the button's border radius
                    }}
                />
                <span
                    style={{
                        position: "absolute", // Position the text absolutely inside the button
                        top: "50%", // Vertically center the text
                        left: "50%", // Horizontally center the text
                        transform: "translate(-50%, -50%)", // Centering trick
                        color: isEventAvailable(event) ? "#fff" : "#767676", // Text color based on availability
                        fontWeight: "900", // Make the text bold
                        fontSize: "24px", // Adjust text size
                        textAlign: "center", // Center-align the text
                        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)", // Add subtle shadow for readability
                        pointerEvents: "none", // Ensure text does not block button clicks
                    }}
                >
                    {isEventAvailable(event) ? t('capture') : t('notAvailable')}
                        </span>
            </button>
            {!isTileNeighborOfPlayer(tile.id) && (
            <span
                style={{
                    textAlign: "center", // Center-align the text
                    color: "#FF4D4D",
                }}

            >
                {t("notClose")}
            </span>
            )}
            <p style={{marginTop: '10px', textAlign: 'center'}}>{t("try")}: {tile.attempts}</p>

            <button onClick={onClose}
                    style={{
                        marginTop: '20px',
                        left: "20px",
                        backgroundColor: "#757575",
                        border: "none",
                        transition: "background-color 0.3s ease",
                        borderRadius: "12px",
                        cursor: "pointer",
                        position: "absolute",
                        bottom: "20px",
                        padding: "1px 5px",
                    }}>
                {t("close")}
            </button>
        </div>
    </div>
        )}
    </>
);
};

export default EventScreen;
