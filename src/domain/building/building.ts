import assert from "../../assertions.ts";

export default class Building {
    #name: string;
    #description: string;
    #price: number;
    #bananasPerSecond: number;

    constructor(name: string, description: string, price: number, bananasPerSecond: number) {
        this.#name = name;
        this.#description = description;
        this.#price = price;
        this.#bananasPerSecond = bananasPerSecond;
        this.checkBuilding();
    }

    checkBuilding() {
        assert(this.#description !== null && this.#description !== "", "Description cannot be null or empty");
        assert(this.#bananasPerSecond >= 1, "Bananas per second must be greater than or equal to 1");
        assert(this.#price >= 0, "Price must be greater than or equal to 0");
        assert(this.#name !== null && this.#name !== "", "Name cannot be null or empty");
    }

    getBps() {
        return this.#bananasPerSecond;
    }

    get price() {
        return this.#price;
    }

    static getAllBuildings(): Building[] {
        return [
            new Building("Acuminata", "A sturdy banana tree", 100, 1),
            new Building("Balbisiana", "A productive banana tree", 200, 2),
        ];
    }
}

