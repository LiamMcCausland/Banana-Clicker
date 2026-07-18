import assert from "../../assertions.ts";

export default class Upgrade {
    #modifier: number;
    #price: number;
    #name: string;

    constructor(name: string, price: number, modifier: number) {
        this.#name = name;
        this.#price = price;
        this.#modifier = modifier;
        this.checkUpgrade();
    }

    checkUpgrade() {
        assert(this.#modifier >= 1, "Modifier must be greater than 0");
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
}
