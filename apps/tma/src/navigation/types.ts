import { type ComponentType } from "react";

export interface Route {
  path: string;
  Component: ComponentType;
  icon?: string;
  title?: string;
  nav: boolean;
}
