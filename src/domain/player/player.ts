import Upgrade from "../upgrade/upgrade";
import Building from "../building/building";
import db from "../persistence/connection.ts";
import { hashPassword, verifyPassword, generateSalt } from "../security/hash.ts";
import assert from "../../assertions.ts";
import type Listener from "../listener/listener.ts";


export default class Player {
    #bananas: number;
    #upgrades: Upgrade[];
    #buildings: Building[];
    #listeners: Listener[];
    #username: string;
    #passwordHash: string;
    #passwordSalt: string;

    constructor(username: string, passwordHash: string, passwordSalt: string, bananas: number, upgrades: Upgrade[], buildings: Building[]) {
        this.#bananas = bananas;
        this.#upgrades = upgrades;
        this.#buildings = buildings;
        this.#username = username;
        this.#passwordHash = passwordHash;
        this.#passwordSalt = passwordSalt;

        this.#listeners = [];
        this.checkPlayer();
    }

    // Check player invariants
    checkPlayer() {
        assert(this.#bananas >= 0, "Bananas cannot be negative");
        assert(this.#upgrades !== null, "Upgrades cannot be null");

        for (const upgrade of this.#upgrades) {
            assert(upgrade !== null, "Upgrade cannot be null");
        }

        const hasNoDuplicates = new Set(this.#upgrades.map(upgrade => upgrade.name)).size === this.#upgrades.length;
        assert(hasNoDuplicates, "Player cant have duplicate upgrades");

        assert(this.#buildings !== null, "Buildings cannot be null");
        assert(this.#username !== null && this.#username !== "", "Username cannot be null or empty");
        assert(!/\s/.test(this.#username), "Username cannot contain whitespace");

        assert(this.#passwordHash !== null && this.#passwordHash !== "", "Password hash cannot be null or empty");
        assert(this.#passwordSalt !== null && this.#passwordSalt !== "", "Password salt cannot be null or empty");
    }

    
    // Logs in a player with the given username and password, returning a Player instance if successful
    static async login(username: string, password: string) {
        const result = await db().query(
            `select * from player where username = $1`,
            [username]
        );

        // Check if the player exists, if not throw an exception
        if (result.rows.length === 0) {
            throw new AccountNotFoundException("Couldn't find account with those credentials");
        }

        const row = result.rows[0];

        // Verify the password using the stored salt and hash
        const isValid = await verifyPassword(password, row.password_salt, row.password_hash);
        if (!isValid) {
            throw new AccountNotFoundException("Password Incorrect.");
        }

        // Fetch the player's upgrades and buildings from the database
        const upgradesResult = await db().query(
            'select * from upgrade where owner = $1',
            [username]
        );
        
        const buildingsResult = await db().query(
            'select * from building where owner = $1',
            [username]
        );

        // Map the database rows to Upgrade and Building instances
        const upgrades = upgradesResult.rows.map(row =>
            new Upgrade(row.name, row.description, row.price, row.modifier)
        );

        const buildings = buildingsResult.rows.map(row =>
            new Building(row.name, row.description, row.price, row.bps)
        );

        // Return a new Player instance with the retrieved data
        return new Player(row.username, row.password_hash, row.password_salt, row.bananas, upgrades, buildings);
    }

    // Registers a new player in the database and returns a new Player instance
    static async register(username: string, password: string) {
        const salt = generateSalt();
        const hash = await hashPassword(password, salt);

        await db().query(
            'insert into player (username, password_hash, password_salt, bananas) values ($1, $2, $3, $4)',
            [username, hash, salt, 0]
        );

        return new Player(username, hash, salt, 0, [], []);
    }

    // Registers a listener to be notified of changes to the player state
    registerListener(listener: Listener) {
        this.#listeners.push(listener);
    }

    // Notifies all registerd listensers of changes
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

    // Run every second, adding bananas based on buildings owned, returns the amount of bananas redeemed.
    tick() {
        let bananasPerSecond = 0;

        for (const building of this.#buildings) {
            bananasPerSecond += building.bps;
        }

        this.#bananas += bananasPerSecond;
        this.checkPlayer();
        this.notifyAll();
    }

    // Purchases an upgrade from the shop, returns true if successful, false if not.
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

    // Purchases a building from the shop, returns true if successful, false if not.
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

    // Save player state to the database, including upgrades and buildings
    async save() {
        
        // Save player state to database
        this.checkPlayer();
        await db().query('update player set bananas = $1 where username = $2', [this.#bananas, this.#username]);

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
        throw new Error("Save complete");
    }
}

// Custom exceptions for player actions:

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
