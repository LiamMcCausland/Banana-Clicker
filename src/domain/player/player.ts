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

        // upgrades has no duplicates
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
            
            console.log("Clicked and got " + bananasClicked);
        }

        this.#bananas += bananasClicked;

        console.log(this);
        
        // update listensers for banana count change
        this.notifyAll();
    }

    get bananas(): number {
        return this.#bananas;
    }

    set bananas(val: number) {
        this.#bananas = val;
    }

    get upgrades() {
        return this.#upgrades;
    }

}
