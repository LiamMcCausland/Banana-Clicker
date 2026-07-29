import Upgrade from "../upgrade/upgrade.ts"
import assert from "../../assertions.ts";
import db from "../persistence/connection.ts";
import type Listener from "../listener/listener.ts";
import Building from "../building/building.ts";

export default class Player {
    #bananas: number;
    #upgrades: Upgrade[];
    #buildings: Building[];
    #listeners: Listener[];
    #username: string;
    #password: string;

    constructor(username: string, password: string, bananas: number, upgrades: Upgrade[], buildings: Building[]) {
        this.#bananas = bananas;
        this.#upgrades = upgrades;
        this.#buildings = buildings;
        this.#username = username;
        this.#password = password;

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

        assert(this.#buildings !== null, "Buildings cannot be null");
        assert(this.#username !== null && this.#username !== "", "Username cannot be null or empty");
        assert(this.#password !== null && this.#password !== "", "Password cannot be null or empty");

        //Check if it contains whitespace
        assert(!/\s/.test(this.#username), "Username cannot contain whitespace");
        assert(!/\s/.test(this.#password), "Password cannot contain whitespace");
    }

    static async login(username: string, password: string) {
        const result = await db().query(`select * from player where username = $1 and password = $2`, [username, password]);

        if (result.rows.length === 0) {
            throw new AccountNotFoundException("Invalid login");
        }

        const row = result.rows[0];

        const upgradesResult = await db().query(
            'select * from upgrade where owner = $1',
            [username]);

        const buildingsResult = await db().query(
            'select * from building where owner = $1',
            [username]
        );

        const upgrades = upgradesResult.rows.map(row =>
            new Upgrade(row.name, row.description, row.price, row.modifier)
        );


        const buildings = buildingsResult.rows.map(row =>
            new Building(row.name, row.description, row.price, row.bps)
        );

        return new Player(row.username, row.password, row.bananas, upgrades, buildings);
    }

    static async register(username: string, password: string) {
        await db().query('insert into player (username, password, bananas) values ($1, $2, $3)', [username, password, 0]);

        return new Player(username, password, 0, [], []);
    }

    registerListener(listener: Listener) {
        this.#listeners.push(listener);
    }

    notifyAll() {
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
        this.notifyAll();
    }

    tick() {
        let bananasPerSecond = 0;

        for (const building of this.#buildings) {
            bananasPerSecond += building.bps;
        }

        this.#bananas += bananasPerSecond;
        this.checkPlayer();
        this.notifyAll();
    }

    purchaseUpgrade(upgrade: Upgrade) {

        let success = false;
        if (!upgrade) {
            throw new UpgradeNotFoundException("Upgrade not found in shop");
        } else if (this.#upgrades.some(u => u.name === upgrade.name)) {
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

    purchaseBuilding(building: Building) {
        let success = false;
        if (!building) {
            throw new BuildingNotFoundException("Building not found in shop");
        } else {
            if (this.#bananas >= building.price) {
                this.#bananas -= building.price;
                this.#buildings.push(building);
                success = true;
            } else {
                throw new NotEnoughBananasException("Not enough bananas to purchase this building, click for more!");
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

    get buildings() {
        return this.#buildings;
    }

    set bananas(val: number) {
        this.#bananas = val;
        this.checkPlayer();
    }

    async save() {
        console.log("SAVE START", performance.now());
        
        // Save player state to database
        this.checkPlayer();
        await db().query('update player set bananas = $1 where username = $2', [this.#bananas, this.#username]);

        console.log(this.#upgrades.map(u => u.name));

        // Save upgrades to database
        await db().query('delete from upgrade where owner = $1', [this.#username]);
        for (const upgrade of this.#upgrades) {
                await db().query('insert into upgrade (name, description, price, modifier, owner) values ($1, $2, $3, $4, $5)', [upgrade.name, upgrade.description, upgrade.price, upgrade.modifier, this.#username]);
        }

        // Save buildings to database
        await db().query('delete from building where owner = $1', [this.#username]);
        for (const building of this.#buildings) {
            await db().query('insert into building (name, description, price, bps, owner) values ($1, $2, $3, $4, $5)', [building.name, building.description, building.price, building.bps, this.#username]);
        }
        console.log("SAVE END", performance.now());
        throw new Error("Save complete");
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

export class AccountNotFoundException extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class BuildingNotFoundException extends Error {
    constructor(message: string) {
        super(message);
    }
}
