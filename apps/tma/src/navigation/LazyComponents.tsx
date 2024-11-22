// apps/tma/src/navigation/LazyComponents.tsx

import { lazy } from "react";

export const ProductionPage = lazy(
  () => import("@/pages/Production/Production")
);
export const MarketPage = lazy(() => import("@/pages/Market/Market"));
export const MapPage = lazy(() => import("@/pages/Map/Map"));
export const CommunityPage = lazy(() => import("@/pages/Community/Community"));
export const ProductionItem = lazy(() => import("@/pages/Mine/MineItem"));
export const Settings = lazy(() => import("@/pages/Settings/Settings"));
export const Crypto = lazy(() => import("@/pages/Crypto/Crypto"));
export const EventPage = lazy(() => import("@/pages/Event/EventPage"));
