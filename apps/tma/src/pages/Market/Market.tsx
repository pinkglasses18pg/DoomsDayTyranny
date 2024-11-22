// apps/tma/src/pages/Market/Market.tsx

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCommonStore } from "@/components/StoreContext";

const Market = () => {
  const { t } = useTranslation();

  const events = useCommonStore((state) => state.events); // All available events
  const mapData = useCommonStore((state) => state.mapData); // Map state
  const isTileNeighborOfPlayer = useCommonStore((state) => state.isTileNeighborOfPlayer);
  const getEventById = useCommonStore((state) => state.getEventById);

  // Get tiles that are neighbors of the player and have events
  const tilesWithEvents = mapData.filter(
      (tile) => tile.hasEvent && isTileNeighborOfPlayer(tile.id)
  );

  // Match tiles with their events and include the tile ID for uniqueness
  const nearbyEvents = tilesWithEvents
      .map((tile) => {
        const event = getEventById(tile.eventId!);
        return event ? { tile, event } : null;
      })
      .filter((item): item is { tile: typeof tilesWithEvents[0]; event: typeof events[0] } => item !== null);

  return (
      <div className="flex flex-col pb-8 gap-2">
        {nearbyEvents.map(({ tile, event }) => (
            <Link
                key={`${event.id}-${tile.id}`} // Combine event ID and tile ID for unique keys
                to={`/event/${event.id}?tileId=${tile.id}`} // Pass tile ID as query parameter
                className="grid grid-cols-market-items"
            >
              <img
                  className="h-full w-full z-10"
                  src={event.questImage} // Event icon
                  alt={event.name}
              />
              <div className="flex flex-col justify-center gap-3 px-2.5">
                <span className="text-2xs text-darkGrayM">{t("event")}</span>
                <span className="text-white text-xs">{t(event.name)}</span>
              </div>
              <div className="flex flex-col justify-center items-end gap-3 px-2.5">
                <span className="text-darkGrayM text-2xs px-4">{t("reward")}:</span>
                <div className="flex gap-2">
              <span className="text-white text-xs">
                {event.rewards.hardReward} Hard Currency
              </span>
                </div>
              </div>
            </Link>
        ))}
      </div>
  );
};

export default Market;
