import assert from "../../assertions.ts";

export default class Building {
    #name: string;
    #description: string;
    #price: number;
    #bananasPerSecond: number;
    #quantity: number;
    
    constructor(name: string, description: string, price: number, bananasPerSecond: number, quantity: number) {
        this.#name = name;
        this.#description = description;
        this.#price = price;
        this.#bananasPerSecond = bananasPerSecond;
        this.#quantity = quantity;
        this.checkBuilding();
    }

    checkBuilding() {
        assert(this.#description !== null && this.#description !== "", "Description cannot be null or empty");
        assert(this.#bananasPerSecond >= 1, "Bananas per second must be greater than or equal to 1");
        assert(this.#price >= 0, "Price must be greater than or equal to 0");
        assert(this.#name !== null && this.#name !== "", "Name cannot be null or empty");
        assert(this.#quantity >= 0, "Quantity must be greater than or equal to 0");
    }

    getBps() {
        return this.#bananasPerSecond;
    }
}
    
