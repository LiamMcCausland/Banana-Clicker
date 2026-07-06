import { UpgradeType } from "../upgrade/upgrade-type.ts";
import Upgrade from "../upgrade/upgrade.ts"

export class Store {
  private shopItems: Upgrade[];

  constructor() {
    this.shopItems = [];
      
    // set shop items to all items in upgrade types
    // TODO: Fix enum logic
    for (const upgradeType in UpgradeType) {
      if (UpgradeType[upgradeType] !== UpgradeType.DOUBLE_CLICK) {
        this.shopItems.push(new Upgrade(UpgradeType[upgradeType], 2, 10));
      } else if (UpgradeType[upgradeType] === UpgradeType.TRIPLE_CLICK) {
        this.shopItems.push(new Upgrade(UpgradeType[upgradeType], 3, 20));
      }
    }
  }
}
