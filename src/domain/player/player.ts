import Upgrade from "../upgrade/upgrade.ts"
import assert  from "../../assertions.ts";
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
