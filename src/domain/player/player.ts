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
    #logged: boolean;

    constructor(username: string, password: string, bananas: number, upgrades: Upgrade[], buildings: Building[]) {
        this.#bananas = bananas;
        this.#upgrades = upgrades;
        this.#buildings = buildings;
        this.#username = username;
        this.#password = password;

        this.#logged = false;
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

    static async login(username: string, password: string) {
        const result = await db().query(`select * from player where username = $1 and password = $2`, [username, password]);

        if (result.rows.length === 0) {
            throw new AccountNotFoundException("Invalid login");
        }

        const row = result.rows[0];

        const upgradesResult = await db().query(
            `
        select u.*
        from upgrade u
        join player_upgrade pu
        on u.name = pu.upgrade
        where pu.player = $1
        `,
            [username]);

        const buildingsResult = await db().query(
            `
        select b.*, pb.quantity
        from building b
        join player_building pb
        on b.name = pb.building
        where pb.player = $1
        `,
            [username]
        );

        const upgrades = upgradesResult.rows.map(row =>
            new Upgrade(
                row.name,
                row.description,
                row.price,
                row.modifier
            )
        );


        const buildings = buildingsResult.rows.map(row =>
            new Building(
                row.name,
                row.description,
                row.price,
                row.bps,
                row.quantity
            )
        );

        return new Player(
            row.username,
            row.password,
            row.bananas,
            upgrades,
            buildings
        );
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

        //persist player state to database:
        this.save();

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
        this.save();
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

    async save() {
        // Save player state to database
        this.checkPlayer();
        await db().query('update player set bananas = $1 where username = $2', [this.#bananas, this.#username]);

        // Save upgrades to database
        await db().query('delete from player_upgrade where player = $1', [this.#username]);
        for (const upgrade of this.#upgrades) {
            await db().query('insert into player_upgrade (player, upgrade) values ($1, $2)', [this.#username, upgrade.name]);
        }

        // Save buildings to database
        await db().query('delete from player_building where player = $1', [this.#username]);
        for (const building of this.#buildings) {
            await db().query('insert into player_building (player, building, quantity) values ($1, $2, $3)', [this.#username, building.name, building.quantity]);
        }
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
