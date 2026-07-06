import Upgrade from "../upgrade/upgrade.ts"
import assert  from "../../assertions.ts";

export class Player {
    private bananas: number;
    private upgrades: Upgrade[];

    constructor() {
        this.bananas = 0;
        this.upgrades = [];

        this.checkPlayer();
    }

    checkPlayer() {
        assert(this.bananas >= 0, "Bananas cannot be negative");
        assert(this.upgrades !== null, "Upgrades cannot be null");

        // upgrades has no duplicates
    }


    // Run when banana is clicked
    click() {
        let bananasClicked = 1;

        // loop over each upgrade, applying them in order
        for (const upgrade of this.upgrades) {
            bananasClicked = bananasClicked * upgrade.getModifier();
        }

        this.bananas += bananasClicked;
    }
}
