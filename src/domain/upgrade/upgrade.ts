import { UpgradeType } from "./upgrade-type.ts"
import assert from "../../assertions.ts";

export default class Upgrade {
    #upgradeType: UpgradeType;
    #modifier: number;
    #price: number;
    #name: string;

    constructor(upgradeType: UpgradeType) {
        this.#upgradeType = upgradeType;
        this.getInfoByType(upgradeType);

        this.checkUpgrade();
    }

    checkUpgrade() {
        assert(this.#modifier >= 1, "Modifier must be greater than 0");
        assert(this.#price > 0, "Price must be greater than 0");
        assert(this.#name !== null && this.#name !== "", "Name cannot be null or empty");
        assert(this.#upgradeType !== null, "Upgrade type cannot be null");
    }

    getInfoByType(type: UpgradeType){
        switch (type) {
            case UpgradeType.DOUBLE_CLICK:
                this.#modifier = 2;
                this.#price = 50;
                this.#name = "Double Click";
                return;
            case UpgradeType.TRIPLE_CLICK:
                this.#modifier = 3;
                this.#price = 100;
                this.#name = "Triple Click";
                return;
            default:
                throw new Error("Invalid upgrade type");
        }
    }
               
    get modifier() {
        return this.#modifier;
    }

    get price() {
        return this.#price;
    }
    
    get type() {
        return this.#upgradeType;
    }

    get name() {
        return this.#name;
    }
        
}
