import Upgrade from "../upgrade/upgrade";
import Building from "../building/building";
import db from "../persistence/connection.ts";
import { hashPassword, verifyPassword, generateSalt } from "../security/hash.ts";
import assert from "../../assertions.ts";
import type Listener from "../listener/listener.ts";
import { AccountNotFoundException, NotEnoughBananasException, DuplicateUpgradeException, UpgradeNotFoundException, BuildingNotFoundException } from "../../exceptions/exceptions.ts";
import ChainLoader from "./chain-loader.ts";
import seedrandom from "seedrandom";

export default class Player {
    #bananas: number;
    #upgrades: Upgrade[];
    #buildings: Building[];
    #listeners: Listener[];
    #username: string;
    #passwordHash: string;
    #passwordSalt: string;
    #chainLoader: ChainLoader;
    #roboBuyEnabled: boolean;
    #roboBuyState: string;

    constructor(username: string, passwordHash: string, passwordSalt: string, bananas: number, upgrades: Upgrade[], buildings: Building[], chainLoader: ChainLoader) {
        this.#bananas = bananas;
        this.#upgrades = upgrades;
        this.#buildings = buildings;
        this.#username = username;
        this.#passwordHash = passwordHash;
        this.#passwordSalt = passwordSalt;
        this.#listeners = [];
        this.#chainLoader = chainLoader;
        this.#roboBuyEnabled = false;
        this.#roboBuyState = "Robo-buy is disabled";
        this.#checkPlayer();
    }

    // Check player invariants
    #checkPlayer() {
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
    static async login(username: string, password: string, chainLoader: ChainLoader) {
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
        const upgrades = await Upgrade.fetchUpgrades(username);
        const buildings = await Building.fetchBuildings(username);

        // Return a new Player instance with the retrieved data
        return new Player(row.username, row.password_hash, row.password_salt, row.bananas, upgrades, buildings, chainLoader);
    }

    // Registers a new player in the database and returns a new Player instance
    static async register(username: string, password: string, chainLoader: ChainLoader) {
        const salt = generateSalt();
        const hash = await hashPassword(password, salt);

        await db().query(
            'insert into player (username, password_hash, password_salt, bananas) values ($1, $2, $3, $4)',
            [username, hash, salt, 0]
        );

        return new Player(username, hash, salt, 0, [], [], chainLoader);
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
        this.#checkPlayer();
        this.notifyAll();
    }

    // Functions run each second via the player controller
    tick() {
        this.#buildingTick();
        this.#roboBuyTick();
    }

    // Adds bananas from buildings each second
    #buildingTick() {
        let bananasPerSecond = 0;

        for (const building of this.#buildings) {
            bananasPerSecond += building.bps;
        }

        this.#bananas += bananasPerSecond;
        this.#checkPlayer();
        this.notifyAll();
    }

    // Toggles the robo-buy feature on or off
    toggleRoboBuy(enabled: boolean) {
        this.#roboBuyEnabled = enabled; 
        this.notifyAll();
    }

    // If robo-buy is enabled, this function will attempt to purchase the next upgrade in the chain if the player has enough bananas.
    async #roboBuyTick() {
        if (this.#roboBuyEnabled) {
            const rand = seedrandom(this.#username).quick();
            let lastPurchased = this.#upgrades[this.#upgrades.length - 1];
            const next = await this.#chainLoader.predict(lastPurchased, rand);

            
            if (next && !this.#upgrades.includes(next)) {
                this.#roboBuyState = "Next upgrade to purchase: " + next.name + " for " + next.price + " bananas";
                try {
                    this.purchaseUpgrade(next);
                    this.#roboBuyState = "Purchased upgrade!";
                } catch (e) {
                    if (e instanceof Error) {
                        console.log(e.message);
                    }
                }
            } 
        } else {
            this.#roboBuyState = "Robo-buy is disabled";
        }
        
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
        this.#checkPlayer();
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
        this.#checkPlayer();
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
        this.#checkPlayer();
    }

    get username() {
        return this.#username;
    }

    get roboBuyState() {
        return this.#roboBuyState;
    }
    
    // Save player state to the database, including upgrades and buildings
    async save() {

        // Save player state to database
        this.#checkPlayer();
        await db().query('update player set bananas = $1 where username = $2', [this.#bananas, this.#username]);

        // Tell upgrades and buildings to save themselves to the database under this player's username
        await Upgrade.save(this.#upgrades, this.#username);
        await Building.save(this.#buildings, this.#username);

        throw new Error("Save complete");
    }
}

