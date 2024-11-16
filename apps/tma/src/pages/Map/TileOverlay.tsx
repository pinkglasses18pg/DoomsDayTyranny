// src/components/TileOverlay.tsx

import React from 'react';

interface TileOverlayProps {
    owner: 'player' | 'human';
}

const TileOverlay: React.FC<TileOverlayProps> = ({ owner }) => {
    const overlayStyle: React.CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor:
            owner === 'player'
                ? 'rgba(247, 39, 31, 0.25)' // Красная маска
                : 'rgba(29, 0, 173, 0.25)', // Синяя маска
        pointerEvents: 'none',
    };

    return <div style={overlayStyle}></div>;
};

export default TileOverlay;