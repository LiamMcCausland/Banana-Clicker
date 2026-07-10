import Upgrade from "./upgrade.ts";
import DoubleClickUpgrade from "./double-click.ts";
import TripleClickUpgrade from "./triple-click.ts";

export const ALL_UPGRADES: Upgrade[] = [
  new DoubleClickUpgrade(),
  new TripleClickUpgrade(),
];
