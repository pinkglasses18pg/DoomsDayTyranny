// src/components/EventScreen.tsx
import React from 'react';
import {TileType} from "@/store/types.ts";

interface EventScreenProps {
    tile: TileType;
    onClose: () => void;
}

const EventScreen: React.FC<EventScreenProps> = ({ tile, onClose }) => {
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
                onClick={(e) => e.stopPropagation()} // Предотвращаем закрытие при клике внутри
            >
                <h2>Ивент на тайле {tile.id}</h2>
                <p>Описание ивента...</p>
                <button onClick={onClose}>Закрыть</button>
            </div>
        </div>
    );
};

export default EventScreen;