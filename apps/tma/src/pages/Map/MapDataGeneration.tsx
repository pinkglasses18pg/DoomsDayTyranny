import { TileType } from "@/store/types";
import { EventType } from "@/store/types";
import rawEventConfig from "@/event_config.json"; // Import event config

// Parse the event configuration
const events: EventType[] = (rawEventConfig as { event: EventType }[]).map(item => item.event);
//const events: EventType[] = rawEventConfig.map((item) => item.event);
//const events: EventType[] = Object.values(rawEventConfig[0]);


export const generateMapData = (): TileType[] => {
    const mapWidth = 12; // Number of tiles along the X-axis
    const mapHeight = 9; // Number of tiles along the Y-axis

    const centerX = Math.ceil(mapWidth / 2); // Center tile X-coordinate
    const centerY = Math.ceil(mapHeight / 2); // Center tile Y-coordinate

    console.log("Raw event config:", rawEventConfig);

    // Create a lookup for tiles with events for faster assignment
    const tileEventMap: Record<string, EventType> = {};

    console.log("events : ",events);

    // Map events to their tiles
    events.forEach((event) => {
        console.log("check event.generation.tileList : ", event.generation.tileList);
        event.generation.tileList.forEach((tileId) => {
            tileEventMap[tileId] = event;

        });
    });

    console.log("tileEventMap : ", tileEventMap);

    const mapData: TileType[] = [];

    for (let y = 1; y <= mapHeight; y++) {
        for (let x = 1; x <= mapWidth; x++) {
            const id = `${y}-${x}`; // Generate tile ID
            const event = tileEventMap[id]; // Check if this tile has an event

            // Generate the tile
            mapData.push({
                id,
                x,
                y,
                owner: x === centerX && y === centerY ? "player" : "human", // Central tile belongs to the player
                hasEvent: !!event, // true if an event exists for this tile
                eventId: event?.id, // ID of the associated event, if any
            });
        }
    }

    return mapData;
};

