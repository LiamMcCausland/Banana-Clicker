import Upgrade from "../upgrade/upgrade.ts"
import assert from "../../assertions.ts";
import type Listener from "../listener/listener.ts";

export default class Player {
    #bananas: number;
    #upgrades: Upgrade[];

    // list of people who are listening to the player
    #listeners: Listener[];

    constructor() {
        this.#bananas = 0;
        this.#upgrades = [];
        this.#listeners = [];

        this.checkPlayer();
    }

    checkPlayer() {
        assert(this.#bananas >= 0, "Bananas cannot be negative");
        assert(this.#upgrades !== null, "Upgrades cannot be null");

        for (const upgrade of this.#upgrades) {
            assert(upgrade !== null, "Upgrade cannot be null");
        }

        // check no duplicate upgrades
        const hasNoDuplicates = new Set(this.#upgrades.map(upgrade => upgrade.name)).size === this.#upgrades.length;
        assert(hasNoDuplicates, "Player cant have duplicate upgrades");

    }

    registerListener(listener: Listener) {
        this.#listeners.push(listener);
    }

    private notifyAll() {
        this.#listeners.forEach((l) => l.notify());
    }

    // Run when banana is clicked
    click() {
        let bananasClicked = 1;

        // loop over each upgrade, applying them in order
        for (const upgrade of this.#upgrades) {
            bananasClicked = bananasClicked * upgrade.modifier;
        }

        this.#bananas += bananasClicked;
        this.checkPlayer();

        // update listensers for banana count change
        this.notifyAll();
    }

    purchaseUpgrade(upgrade: Upgrade): boolean {

        let success = false;
        if (!upgrade) {
            throw new UpgradeNotFoundException("Upgrade not found in shop");
        } else if (this.#upgrades.includes(upgrade)) {
            throw new DuplicateUpgradeException("Player cant have duplicate upgrades")
        } else {
            if (this.#bananas >= upgrade.price) {
                this.#bananas -= upgrade.price;
                this.#upgrades.push(upgrade);
                success = true;
            } else {
                throw new NotEnoughBananasException("Not enough bananas to purchase this upgrade");
            }
        }

        this.notifyAll();
        this.checkPlayer();
        return success;
    }
s
    get bananas(): number {
        return this.#bananas;
    }

    get upgrades() {
        return this.#upgrades;
    }

    set bananas(val: number) {
        this.#bananas = val;
        this.checkPlayer();
    }

}

class NotEnoughBananasException extends Error {
    constructor(message: string) {
        super(message);
    }
}
class UpgradeNotFoundException extends Error {
    constructor(message: string) {
        super(message);
    }
}
class DuplicateUpgradeException extends Error {
    constructor(message: string) {
        super(message);
    }
}
