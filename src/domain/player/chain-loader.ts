import Upgrade from '../upgrade/upgrade.ts';

export default class ChainLoader {

    #chain = new Map<string, Map<string, number>>();
    #totals = new Map<string, number>();
    #upgradesConversionTable = new Map<string, string>();
    #reverseConversionTable = new Map<string, string>();
    #upgrades: Upgrade[] = [];

    // Factory method to create a ChainLoader instance and load the model from a CSV file
    static async create(filePath: string): Promise<ChainLoader> {
        const loader = new ChainLoader();
        await loader.#loadFromCSV(filePath);
        await loader.#fillConversionTable();
        return loader;
    }

    // Fills the conversion tables for upgrades and buildings mapping the given state words to upgrades and buildings
    async #fillConversionTable() {
        this.#upgrades = await Upgrade.getAllUpgrades();

        // map each upgrade to a letter a to j
        for (const upgrade of this.#upgrades) {
            const letter = String.fromCharCode(97 + this.#upgrades.indexOf(upgrade));
            this.#upgradesConversionTable.set(upgrade.name, letter);
            this.#reverseConversionTable.set(letter, upgrade.name);
        }
    }

    // loades the model from a CSV file and populates the chain and totals maps
    async #loadFromCSV(filePath: string) {
        try {
            const response = await fetch(filePath);
            const fileContent = await response.text();

            // split by new line, catching both \n and \r\n in case
            const lines = fileContent.split(/\r?\n/);

            for (const line of lines.slice(1)) {
                const cleanLine = line.trim();

                if (!cleanLine) {
                    continue;
                }

                // find all occurrences of quoted strings and remove the quotes then split by commas
                // see source
                const values = cleanLine.replace(/"/g, "").split(",");

                const current = values[0];
                const next = values[1];
                const count = parseInt(values[2], 10);
                const total = parseInt(values[3], 10);

                if (!this.#chain.has(current)) {
                    this.#chain.set(current, new Map());
                }

                this.#chain.get(current)!.set(next, count);
                this.#totals.set(current, total);
            }
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            }
        }
    }


    // Predicts the next word given a current word and a random number
    async predict(current: Upgrade, random: number) {
        if (!current) {
            return this.#upgrades[0];
        }

        let result = null
        let upgradeResult = null;
        let currentState = this.#upgradesConversionTable.get(current.name);

        // Get the transition map for the current state
        const transitions = this.#chain.get(currentState!);

        // If there are transitions and a total count for the current state, perform weighted random selection
        if (transitions && this.#totals.get(currentState!)) {
            const total = this.#totals.get(currentState!)!;
            let rand = random * total;

            for (const [nextState, count] of transitions.entries()) {
                rand -= count;
                if (rand <= 0) {
                    result = nextState;
                    break;
                    // break if we found a next state
                }
            }
        }


        const resultUpgradeName = this.#reverseConversionTable.get(result!);
        for (const upgrade of this.#upgrades) {
            if (upgrade.name === resultUpgradeName) {
                upgradeResult = upgrade;
            }
        }

        return upgradeResult;
    }
}
