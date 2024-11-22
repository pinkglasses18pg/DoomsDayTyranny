import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { useCommonStore } from "@/components/StoreContext";
import EventScreen from "@/pages/Map/EventScreen";

const EventPage: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const location = useLocation();
    const getEventById = useCommonStore((state) => state.getEventById);
    const mapData = useCommonStore((state) => state.mapData);
    const mines = useCommonStore((state) => state.mines);
    const coins = useCommonStore((state) => state.coin);
    const buyEvent = useCommonStore((state) => state.buyEvent);
    const useResources = useCommonStore((state) => state.useResources);
    const canCraftEvent = useCommonStore((state) => state.canCraftEvent);

    const event = getEventById(eventId!);
    const queryParams = new URLSearchParams(location.search);
    const tileId = queryParams.get("tileId");

    if (!event || !tileId) {
        return (
            <div>
                <h1>Event Not Found</h1>
                <p>Event with ID {eventId} or tile with ID {tileId} does not exist.</p>
            </div>
        );
    }

    const tile = mapData.find((tile) => tile.id === tileId);

    if (!tile) {
        return (
            <div>
                <h1>Tile Not Found</h1>
                <p>Tile with ID {tileId} does not exist.</p>
            </div>
        );
    }

    return (
        <EventScreen
            tile={tile}
            event={event}
            onClose={() => window.history.back()}
            canCraftEvent={canCraftEvent} // Pass your actual `canCraftEvent` logic
            onCraft={(event) => {useResources(event.craftEvent); buyEvent(event.price)}} // Implement crafting logic
            mines={mines} // Pass mines data
            coins={coins} // Pass current player coins
        />
    );
};

export default EventPage;
