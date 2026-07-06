import { UpgradeType } from "./upgrade-type.ts"

export default class Upgrade {
  private type: UpgradeType;
  private modifier: number;
  private price: number;

  constructor(type: UpgradeType, modifier: number, price: number) {
    this.type = type;
    this.modifier = modifier;
    this.price = price;
  }

  public getModifier() {
    return this.modifier;
  }

  public getType() {
    return this.type;
  }

  public getPrice() {
    return this.price;
  }
}
