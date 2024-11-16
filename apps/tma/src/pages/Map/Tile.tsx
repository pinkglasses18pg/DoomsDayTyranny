// src/components/Tile.tsx
import React from 'react';
import { TileType } from '@/store/types';
import TileOverlay from './TileOverlay.tsx';

interface TileProps {
    tile: TileType;
    onClick: (tile: TileType) => void;
}

const Tile: React.FC<TileProps> = ({ tile, onClick }) => {
    const handleClick = () => {
        if (tile.hasEvent) {
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
    </div>
);
};

export default Tile;