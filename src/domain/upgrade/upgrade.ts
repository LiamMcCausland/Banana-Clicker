import assert from "../../assertions.ts";

export default class Upgrade {
    #modifier: number;
    #price: number;
    #name: string;
    #description: string;

    constructor(name: string, description: string, price: number, modifier: number) {
        this.#name = name;
        this.#description = description;
        this.#price = price;
        this.#modifier = modifier;
        this.checkUpgrade();
    }

    checkUpgrade() {
        assert(this.#description !== null && this.#description !== "", "Description cannot be null or empty");
        assert(this.#modifier >= 1, "Modifier must be greater than or equal to 1");
        assert(this.#price > 0, "Price must be greater than 0");
        assert(this.#name !== null && this.#name !== "", "Name cannot be null or empty");
    }

    get modifier() {
        return this.#modifier;
    }

    get price() {
        return this.#price;
    }

    get name() {
        return this.#name;
    }

    get description() {
        return this.#description;
    }

    // Returns all available upgrades
    static getAllUpgrades(): Upgrade[] {
        return [
            new Upgrade("Double Click", "Double bananas per click", 50, 2),
            new Upgrade("Triple Click", "Triple bananas per click", 100, 3),
        ];
    }

}
