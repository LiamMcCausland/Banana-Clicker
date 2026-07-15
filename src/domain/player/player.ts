import Upgrade from "../upgrade/upgrade.ts"
import assert from "../../assertions.ts";
import type Listener from "../listener/listener.ts";

export default class Player {
    #bananas: number;
    #upgrades: Upgrade[];
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

    // Run when banana is clicked, returns the amount of bananas redeemed.
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
            throw new DuplicateUpgradeException("Player cant have duplicate upgrades, choose a different upgrade.")
        } else {
            if (this.#bananas >= upgrade.price) {
                this.#bananas -= upgrade.price;
                this.#upgrades.push(upgrade);
                success = true;
            } else {
                throw new NotEnoughBananasException("Not enough bananas to purchase this upgrade, click for more!");
            }
        }

        this.notifyAll();
        this.checkPlayer();
        return success;
    }
    
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

export class NotEnoughBananasException extends Error {
    constructor(message: string) {
        super(message);
    }
}
export class UpgradeNotFoundException extends Error {
    constructor(message: string) {
        super(message);
    }
}
export class DuplicateUpgradeException extends Error {
    constructor(message: string) {
        super(message);
    }
}
