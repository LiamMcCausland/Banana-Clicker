import assert from "../../assertions.ts";
import Player from "../player/player.ts";
import db from "../persistence/connection.ts";

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

    // Fetches the upgrades for the given username
    static async fetchUpgrades(username: string) {
        const upgradesResult = await db().query(
            'select * from upgrade where owner = $1',
            [username]
        );

        // Map the database rows to Upgrade and Building instances
        const upgrades = upgradesResult.rows.map(row =>
            new Upgrade(row.name, row.description, row.price, row.modifier));

        return upgrades;
    }

    // Saves the given lsit of upgrades to the database under the username given.
    static async save(upgrades: Upgrade[], username: string) {
        // Save upgrades to database
        await db().query('delete from upgrade where owner = $1', [username]);
        for (const upgrade of upgrades) {
            await db().query('insert into upgrade (name, description, price, modifier, owner) values ($1, $2, $3, $4, $5)', [upgrade.name, upgrade.description, upgrade.price, upgrade.modifier, username]);
        }
    }

    // Returns all available upgrades in the game
    static async getAllUpgrades(): Promise<Upgrade[]> {
        const upgradesResult = await db().query("select * from purchaseable_upgrades");
        const upgrades: Upgrade[] = [];
        for (const row of upgradesResult.rows) {
            upgrades.push(new Upgrade(row.name, row.description, row.price, row.modifier));
        }
        return upgrades;
    }
}
