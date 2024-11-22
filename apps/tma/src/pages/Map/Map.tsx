// src/components/Map.tsx
import React, { useState} from 'react';
import { TileType} from '@/store/types';
import { TransformWrapper, TransformComponent} from 'react-zoom-pan-pinch';
import EventScreen from './EventScreen'; // В будущем реализуем
import Tile from './Tile';

import { useCommonStore } from "@/components/StoreContext.tsx";

const Map: React.FC = () => {
    const [selectedTile, setSelectedTile] = useState<TileType | null>(null);

    const mapData = useCommonStore((state ) => state.mapData);

    const getTileById = useCommonStore((state ) => state.getTileById);
    const events = useCommonStore((state ) => state.events);

    const canCraftEvent = useCommonStore((state) => state.canCraftEvent);
    const useResources = useCommonStore((state) => state.useResources);
    const mines = useCommonStore((state) => state.mines);
    const coins = useCommonStore((state) => state.coin);
    const buyEvent = useCommonStore((state) => state.buyEvent);



    //console.log("MapData : ", mapData);

    const handleTileClick = (tile: TileType) => {
        setSelectedTile(tile);
        // В будущем: открыть экран ивента
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

    const getEventForTile = (tileId: string) => {
        const tile = getTileById(tileId);
        if (tile?.eventId) {
            return events.find((event) => event.id === tile.eventId);
        }
        return undefined;
    };


    return (
        <div className="map-page">
            <TransformWrapper
                minScale={1}
                maxScale={1}
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
                        {mapData.map((tile) => {
                            const event = getEventForTile(tile.id); // Correct syntax for declaring a variable
                            return (
                            <Tile
                            key={tile.id}
                            tile={tile}
                            onClick={handleTileClick}
                            event={event} // Pass the event object to the Tile component
                             />
                    );
                    })}
                    </div>
                </TransformComponent>
            </TransformWrapper>
            {selectedTile && (
                <EventScreen
                    tile={selectedTile}
                    event={getEventForTile(selectedTile.id)} // Pass the event details
                    canCraftEvent={canCraftEvent}
                    onCraft={(event) => {useResources(event.craftEvent); buyEvent(event.price)}}
                    onClose={() => setSelectedTile(null)}
                    mines={mines}
                    coins={coins}
                />
            )}
        </div>
    );
};





export default Map;

// Функция для вычисления начального положения, чтобы отображать центральный тайл
/*const calculateInitialPosition = () => {
    const mapWidth = calculateMapWidth();
    const mapHeight = calculateMapHeight();

    //console.log("mapWidth=", mapWidth);
    //console.log("mapHeight=", mapHeight);

    // Находим центральное положение карты, чтобы начать отображение с середины
    const initialX = -(mapWidth / 2 - window.innerWidth / 2);
    const initialY = -(mapHeight / 2 - window.innerHeight / 2);

    return { initialX, initialY };
};*/
