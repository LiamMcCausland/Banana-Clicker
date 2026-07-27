import assert from "../../assertions.ts";
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

    static async getAllUpgrades(): Promise<Upgrade[]> {
        let upgrades: Upgrade[] = [];
        
        const { rows } = await db().query<{
            name: string;
            description: string;
            price: number;
            modifier: number;
        }>("select * from upgrade;");

        console.log("Retrieved upgrades from database:", rows); // Log the retrieved rows for debugging

        for (const row of rows) {
            const upgrade = new Upgrade(row.name, row.description, row.price, row.modifier);
            upgrades.push(upgrade);
        }
        
        
        return upgrades;
   }
}
