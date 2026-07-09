import { UpgradeType } from "../upgrade/upgrade-type.ts";
import Upgrade from "../upgrade/upgrade.ts";
import Player from "../player/player.ts";
import type Listener from "../listener/listener.ts";
import assert from "../../assertions.ts";

export default class Store {
    #shopItems: Upgrade[];
    #listeners: Listener[];

    constructor() {
        this.#shopItems = [];
        this.#listeners = [];

        // Add all upgrade types to the shop items
        for (const type in UpgradeType) {
            const upgradeType = UpgradeType[type as keyof typeof UpgradeType];
            this.#shopItems.push(new Upgrade(upgradeType));
        }

        this.checkStore();
    }

    checkStore() {
        assert(this.#shopItems !== null, "Shop items cannot be null");
        for (const item of this.#shopItems) {
            assert(item !== null, "Shop item cannot be null");
        }
    }

    purchase(player: Player, upgrade: Upgrade) {
        const upgradeType = upgrade.type;
        const upgradeInShop = this.#shopItems.find(item => item.type === upgradeType);
        
        if (!upgradeInShop) {
            throw new UpgradeNotFoundException("Upgrade not found in shop");
        }

        // remove the item from the ship and give it to the player if they have enough bananas
        if (player.bananas >= upgrade.price) {
            player.bananas = player.bananas - upgrade.price;
            player.upgrades.push(upgrade);
            this.#shopItems.splice(this.#shopItems.indexOf(upgradeInShop), 1);

            
        } else {
            throw new NotEnoughBananasException("Not enough bananas to purchase this upgrade");
        }

        // notify listeners that the store has changed
        this.notifyAll();
        this.checkStore();
    }

    registerListener(listener: Listener) {
        this.#listeners.push(listener);
    }

    private notifyAll() {
        this.#listeners.forEach((l) => l.notify());
    }

    get shopItems() {
        return this.#shopItems;
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
