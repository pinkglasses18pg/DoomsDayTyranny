import { Route } from "./types";
import {
  ProductionPage,
  MarketPage,
  MapPage,
  CommunityPage,
  ProductionItem,
  Crypto, EventPage,
} from "./LazyComponents";
import mining from "@/assets/icons/icon_mining.svg";
import world from "@/assets/icons/world_icon.svg";
import building from "@/assets/icons/icon_quest.svg";
import commutity from "@/assets/icons/icon_comunity.svg";

export const routes: Route[] = [
  {
    path: "/",
    Component: MapPage,
    title: "world",
    icon: world,
    nav: true,
  },
  {
    path: "/tenders",
    Component: ProductionPage,
    title: "production",
    nav: true,
    icon: mining,
  },
  {
    path: "/quests",
    Component: MarketPage,
    title: "building",
    nav: true,
    icon: building,
  },

  {
    path: "/commutity",
    Component: CommunityPage,
    title: "community",
    icon: commutity,
    nav: true,
  },
  {
    path: "/mine/:mine",
    Component: ProductionItem,
    nav: false,
  },

  {
    path: "/event/:eventId",
    Component: EventPage, // Add the EventPage component here
    nav: false,
  },

  {
    path: "/crypto",
    Component: Crypto,
    nav: false,
  },
];

