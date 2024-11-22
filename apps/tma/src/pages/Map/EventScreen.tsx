// src/components/EventScreen.tsx

import { Link } from "react-router-dom";
import React, { useState } from 'react';
import {TileType, EventType, Mines} from "@/store/types.ts";
import ResultScreen from './ResultScreen';
import {useCommonStore} from "@/components/StoreContext.tsx";
import {useSound} from "@/components/sound.ts";
import {LoadIndicator} from "@/components/LoadIndicator.tsx";
import { abbreviateBytes } from "../utils";

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
    const soundInstance = useSound("buyFabric");
    const generateEventsForMap = useCommonStore((state) => state.generateEventsForMap);
    const updateTileOwner = useCommonStore((state) => state.updateTileOwner);
    const isTileNeighborOfPlayer = useCommonStore((state) => state.isTileNeighborOfPlayer);

    const [isLoading, setIsLoading] = useState(false);


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
        return (event.difficulty.baseChance + tile.attempts * event.difficulty.tryMultiplay) * 100; // Convert to percentage
    };

    const isEventAvailable =(event: EventType) => {
      return (isCraftable && coins >= event.price && isTileNeighborOfPlayer(tile.id))
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
                    backgroundColor: "#1F1F1F",
                    color: '#fff',
                    padding: '20px',
                    borderRadius: '8px',
                    width: '90%',
                    maxWidth: '500px',
                }}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <img
                    src={event.image}
                    alt={event.name}
                    style={{ width: '100%', marginBottom: '20px', borderRadius: '8px' }}
                />
                <h2>{event.name}</h2>
                <p>{event.description}</p>
                <p><strong>Owner:</strong> {tile.owner}</p>

                <h3>Requirements:</h3>
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
                         <li key={req.id} >
                             < Link to={`/mine/${req.id}`} style={{textDecoration: "none", color: "#4CAF50"}}>
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
                <p><strong>Soft Currency Cost:</strong> {abbreviateBytes(event.price)} (You have: {abbreviateBytes(coins)})</p>
                <p><strong>Chance:</strong> {calculateChance()}%</p>

                <button
                    onClick={handleCraft}
                    disabled={!isEventAvailable(event)}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: isEventAvailable(event) ? '#4CAF50' : '#ccc',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isEventAvailable(event) ? 'pointer' : 'not-allowed',
                    }}
                >
                    {isEventAvailable(event) ? 'Capture' : 'Not Available'}
                </button>
                <p style={{ marginTop: '10px' }}>Try: {tile.attempts}</p>

                <button onClick={onClose} style={{ marginTop: '20px' }}>
                    Close
                </button>
            </div>
        </div>
            )}
        </>
    );
};

export default EventScreen;
