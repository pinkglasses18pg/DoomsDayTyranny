// src/store/mapSlice.ts

import { MapSlice, TileType, SliceCreator } from "./types";

export const createMapSlice: SliceCreator<keyof MapSlice> = (set, get) => ({
    mapData: [],

    setMapData: (newMapData: TileType[]) => {
        set({ mapData: newMapData });
    },

    // Инициализация карты
    initializeMap: (width : number, height: number, centerX: number, centerY: number) => {
        const { events } = get();
        //const tileEventMap: Record<string, EventType> = {};
        const mapData: TileType[] = [];

        // Helper to check if a tile is neighboring the player
        const isNeighborOfPlayer = (x: number, y: number) => {
            const directions = [
                [0, 1], [1, 0], [0, -1], [-1, 0], // Cardinal
            ];
            return directions.some(([dx, dy]) =>
                mapData.some(tile => tile.owner === "player" && tile.x === x + dx && tile.y === y + dy)
            );
        };


        // Generate map tiles
        for (let y = 1; y <= height; y++) {
            for (let x = 1; x <= width; x++) {
                const id = `${y}-${x}`;
                const isPlayerStart = x === centerX && y === centerY;

                mapData.push({
                    id,
                    x,
                    y,
                    owner: isPlayerStart ? "player" : "human",
                    hasEvent: false,
                    eventId: undefined,
                    attempts: 0,
                });
            }
        }

        // Генерация событий
        const updatedMapData = mapData.map((tile) => {
                if (tile.owner === "player") {
                    return tile; // Пропускаем тайлы игрока
                }

                const neighboring = isNeighborOfPlayer(tile.x, tile.y);

            // События типа build всегда отображаются, если тайл разрешён
            const buildEvents = events.filter(
                (event) =>
                    event.type === "Build" && event.generation.tileList.includes(tile.id)
            );


            if (buildEvents.length > 0) {
                // Выбираем случайное build событие, если их несколько
                const randomBuildEvent =
                    buildEvents[Math.floor(Math.random() * buildEvents.length)];
                return {
                    ...tile,
                    hasEvent: true,
                    eventId: randomBuildEvent.id,
                };
            }


            // Остальные события отображаются только рядом с владениями игрока
            const otherEvents = events.filter((event) => {
                const isAllowedTile = event.generation.tileList.includes(tile.id);
                const isBuildEvent = event.type === "Build"; // Не обрабатываем build (оно уже учтено выше)
                return isAllowedTile && !isBuildEvent && neighboring;
            });

            if (otherEvents.length > 0) {
                // Выбираем случайное событие
                const randomEvent =
                    otherEvents[Math.floor(Math.random() * otherEvents.length)];
                return {
                    ...tile,
                    hasEvent: true,
                    eventId: randomEvent.id,
                };
            }

            return tile; // Если нет подходящих событий, оставляем тайл пустым
        });

        set({ mapData: updatedMapData });
    },

    generateEventsForMap: (capturedTile: TileType) => {
        set((state) => {
            const { mapData } = state;
            const { events } = get();

            // Helper to get neighbors
            const directions = [
                [0, 1], // Up
                [1, 0], // Right
                [0, -1], // Down
                [-1, 0], // Left
            ];
            const neighbors = directions
                .map(([dx, dy]) =>
                    mapData.find((tile) => tile.x === capturedTile.x + dx && tile.y === capturedTile.y + dy)
                )
                .filter(Boolean) as TileType[];

            console.log("Neighbors to process:", neighbors);

            // Update only the neighbors
            neighbors.forEach((tile) => {
                if (!tile.hasEvent && tile.owner !== "player") {
                    const availableEvents = events.filter((event) =>
                        event.generation.tileList.includes(tile.id)
                    );
                    if (availableEvents.length > 0) {
                        const randomEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)];
                        console.log(`Assigning event ${randomEvent.id} to tile ${tile.id}`);
                        tile.hasEvent = true;
                        tile.eventId = randomEvent.id;
                    }
                }
            });

            console.log("Updated neighbors:", neighbors);
        });
    },







    incrementTileAttempts: (tileId: string) => {
        set((state) => {
            const tile = state.mapData.find((tile) => tile.id === tileId);
            if (tile) {
                tile.attempts += 1;
            }
        });
    },

    completeEvent: (tileId: string) => {
        set((state) => {
            const tile = state.mapData.find((tile) => tile.id === tileId);
            if (tile) {
                tile.hasEvent = false;
                tile.eventId = undefined;
                tile.attempts = 0; // Reset attempts or keep for tracking
            }
        });
    },


    // Обновление состояния карты
    updateTileOwner: (tileId: string, newOwner: string) => {
        set((state:any) => {
            const tile = state.mapData.find((tile:TileType) => tile.id === tileId);
            if (tile) {
                tile.owner = newOwner;
            }
        });
    },

    getTileById: (tileId: string) => get().mapData.find((tile:TileType) => tile.id === tileId),

    isTileNeighborOfPlayer: (tileId: string) => {
        const { mapData } = get();
        const targetTile = mapData.find(tile => tile.id === tileId);

        if (!targetTile) {
            console.warn(`Tile with ID ${tileId} not found.`);
            return false;
        }

        const directions = [
            [0, 1], // Up
            [1, 0], // Right
            [0, -1], // Down
            [-1, 0], // Left
        ];

        return directions.some(([dx, dy]) =>
            mapData.some(tile =>
                tile.owner === "player" &&
                tile.x === targetTile.x + dx &&
                tile.y === targetTile.y + dy
            )
        );
    },
});
