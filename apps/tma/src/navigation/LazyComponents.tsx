import { lazy } from "react";

export const ProductionPage = lazy(
  () => import("@/pages/Production/Production")
);
export const MarketPage = lazy(() => import("@/pages/Market/Market"));
export const TendersPage = lazy(() => import("@/pages/Tenders/Tenders"));
export const CommunityPage = lazy(() => import("@/pages/Community/Community"));
export const ProductionItem = lazy(() => import("@/pages/Mine/MineItem"));
export const Settings = lazy(() => import("@/pages/Settings/Settings"));
