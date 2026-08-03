import assert from "../../assertions.ts";
import db from "../persistence/connection.ts"

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
        this.#checkBuilding();
    }

    // Check invariants for the Building class
    #checkBuilding() {
        assert(this.#description !== null && this.#description !== "", "Description cannot be null or empty");
        assert(this.#bananasPerSecond >= 1, "Bananas per second must be greater than or equal to 1");
        assert(this.#price >= 0, "Price must be greater than or equal to 0");
        assert(this.#name !== null && this.#name !== "", "Name cannot be null or empty");
    }

    get bps() {
        return this.#bananasPerSecond;
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

    // Fetches the list of buildings that the given username owns.
    static async fetchBuildings(username: string) {
        const buildingsResult = await db().query(
            'select * from building where owner = $1',
            [username]
        );


        const buildings = buildingsResult.rows.map(row =>
            new Building(row.name, row.description, row.price, row.bps)
        );

        return buildings;

    }

    // Saves the given list of buildings to the databse under the given username
    static async save(buildings: Building[], username: string) {
        // Save buildings to database
        await db().query('delete from building where owner = $1', [username]);
        for (const building of buildings) {
            await db().query('insert into building (name, description, price, bps, owner) values ($1, $2, $3, $4, $5)', [building.name, building.description, building.price, building.bps, username]);
        }
    }

    // Returns all possible buildings in the game
    static getAllBuildings(): Building[] {
        return [
            new Building("Acuminata", "A sturdy banana tree", 100, 1),
            new Building("Balbisiana", "A productive banana tree", 200, 2),
        ];
    }
}

