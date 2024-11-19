// src/components/Tile.tsx
import React from 'react';
import {EventType, TileType} from '@/store/types';
import TileOverlay from './TileOverlay.tsx';

interface TileProps {
    tile: TileType;
    onClick: (tile: TileType) => void;
    event: EventType | undefined; // Updated type
}

const Tile: React.FC<TileProps> = ({ tile, onClick, event }) => {
    const handleClick = () => {
        if (tile.hasEvent || event) {
            onClick(tile);
        }
    };

    return (
        <div
            className="tile"
    onClick={handleClick}
    style={{
        position: 'relative',
            width: '78px',
            height: '78px',
            margin: '1px',
            cursor: tile.hasEvent ? 'pointer' : 'default',
    }}
>
    <img
        src={`/tileset_map/${tile.id}.png`}
    alt={`Tile ${tile.id}`}
    width="78"
    height="78"
    style={{ display: 'block' }}
    />
    <TileOverlay owner={tile.owner as 'player' | 'human'} />

            {/* Иконка ивента, если есть */}
            {event && (
                <div
                    style={{
                        position: 'absolute',
                        top: '0%', // Центрируем внутри тайла
                        left: '0%',
                        width: '78px',
                        height: '78px',
                        backgroundImage: `url(${event.iconBg})`, // Фон из iconBg
                        backgroundSize: 'cover',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <img
                        src={event.icon}
                        alt={event.name}
                        style={{ width: '100%', height: '100%' }} // Иконка внутри iconBg
                    />
                </div>
                )}

    </div>
);
};

export default Tile;