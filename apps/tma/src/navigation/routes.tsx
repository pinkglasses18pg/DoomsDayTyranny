import { Route } from "./types";
import {
  ProductionPage,
  MarketPage,
  TendersPage,
  CommunityPage,
  ProductionItem,
} from "./LazyComponents";
import mining from "@/assets/icons/mining.svg";
import world from "@/assets/icons/world_icon.svg";
import building from "@/assets/icons/factory.svg";
import commutity from "@/assets/icons/comunity.svg";

export const routes: Route[] = [
  {
    path: "/",
    Component: TendersPage,
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
    path: "/market",
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
];

