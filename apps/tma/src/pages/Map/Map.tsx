// src/components/Map.tsx
import React, { useState } from 'react';
//import Tile from './Tile';
import { TileType} from '@/store/types';
import { mapData } from './mapData';
import { TransformWrapper, TransformComponent} from 'react-zoom-pan-pinch';
import EventScreen from './EventScreen'; // В будущем реализуем
import Tile from './Tile';

const Map: React.FC = () => {
    const [selectedTile, setSelectedTile] = useState<TileType | null>(null);

    const handleTileClick = (tile: TileType) => {
        setSelectedTile(tile);
        // В будущем: открыть экран ивента
    };

    // Вычисляем начальные позиции для отображения центрального тайла
    const { initialX, initialY } = calculateInitialPosition();
    console.log("initialX", initialX);
    console.log("initialY", initialY);


    return (
        <div className="map-page">
            <TransformWrapper
                minScale={1}
                maxScale={3}
                initialPositionX={700}
                initialPositionY={500}
                centerOnInit={true}
                wheel={{ step: 50 }}
                doubleClick={{ disabled: false}} // Отключаем зум на двойной клик, чтобы избежать случайного зума
                panning={{ disabled: false }} // Включаем панорамирование (перетаскивание)
                limitToBounds={false} // Отключаем ограничения по границам
                onPanningStop={(ref) => {
                    const { positionX, positionY } = ref.state;
                    const scale = ref.state.scale;

                    // Вычисляем ширину и высоту карты
                    const mapWidth = calculateMapWidth();
                    const mapHeight = calculateMapHeight();

                    // Рассчитываем максимальные смещения по осям
                    const maxPanX = -(mapWidth * scale - window.innerWidth);
                    const maxPanY = -(mapHeight * scale - window.innerHeight);

                    // Ограничиваем смещение по осям, чтобы карта оставалась в пределах
                    const newPositionX = Math.min(0, Math.max(positionX, maxPanX));
                    const newPositionY = Math.min(0, Math.max(positionY, maxPanY));

                    if (newPositionX !== positionX || newPositionY !== positionY) {
                        ref.setTransform(newPositionX, newPositionY, scale);
                    }
                }}
            >
                <TransformComponent>
                    <div
                        className="map-container"
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            width: `${calculateMapWidth()}px`,
                            backgroundColor: 'black',
                        }}
                    >
                        {mapData.map((tile) => (
                            <Tile key={tile.id} tile={tile} onClick={handleTileClick} />
                        ))}
                    </div>
                </TransformComponent>
            </TransformWrapper>
            {selectedTile && <EventScreen tile={selectedTile} onClose={() => setSelectedTile(null)} />}
        </div>
    );
};

// Функция для вычисления ширины карты на основе координат тайлов
const calculateMapWidth = (): number => {
    const maxX = Math.max(...mapData.map((tile) => tile.x));
    return maxX * 80; // 78px тайл + 2px отступы
};

const calculateMapHeight = (): number => {
    const maxY = Math.max(...mapData.map((tile) => tile.y));
    return (maxY + 1.5) * 80; // 78px тайл + 2px отступ
};

// Функция для вычисления начального положения, чтобы отображать центральный тайл
const calculateInitialPosition = () => {
    const mapWidth = calculateMapWidth();
    const mapHeight = calculateMapHeight();

    console.log("mapWidth=", mapWidth);
    console.log("mapHeight=", mapHeight);

    // Находим центральное положение карты, чтобы начать отображение с середины
    const initialX = -(mapWidth / 2 - window.innerWidth / 2);
    const initialY = -(mapHeight / 2 - window.innerHeight / 2);

    return { initialX, initialY };
};

export default Map;

