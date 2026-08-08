import Player from "../../domain/player/player.ts";
import PlayerView from "../../view/player/player-view.ts";
import Upgrade from "../../domain/upgrade/upgrade.ts";
import Building from "../../domain/building/building.ts";
import OutputHandler from "../../view/output-handler.ts";
import ChainLoader from "../../domain/player/chain-loader.ts";

export default class PlayerController {
    #player!: Player;
    #playerView!: PlayerView;
    #output: OutputHandler;
    #chainLoader: ChainLoader;

    constructor(output: OutputHandler, chainLoader: ChainLoader) {
        this.#output = output;
        this.#chainLoader = chainLoader;
    }

    // Login the player and create a new PlayerView for the player
    async login(username: string, password: string) {
        this.#player = await Player.login(username, password, this.#chainLoader);

        this.#playerView = new PlayerView(
            this.#player,
            this,
            this.#output
        );

        this.#player.registerListener(this.#playerView);
        this.#player.notifyAll();
        setInterval(() => this.tick(), 1000);
    }

    // Register a new player and create a new PlayerView for the player
    async register(username: string, password: string) {
        this.#player = await Player.register(username, password, this.#chainLoader);

        this.#playerView = new PlayerView(
            this.#player,
            this,
            this.#output
        );

        this.#player.registerListener(this.#playerView);
        this.#player.notifyAll();
        setInterval(() => this.tick(), 1000);
    }

    // When banana is clicked
    click() {
        this.#player.click();
    }

    // When tick is called, add bananas based on buildings owned
    tick() {
        this.#player.tick();
    }

    // When save is called, save the player to the database
    async save() {
        try {
            await this.#player.save();
        } catch (e: any) {
            this.#output.displayMessage(e.message);
        }
    }

    // When upgrade is chosen
    purchaseUpgrade(upgrade: Upgrade) {
        this.#player.purchaseUpgrade(upgrade);
    }

    // When building is chosen
    purchaseBuilding(building: Building) {
        this.#player.purchaseBuilding(building);
    }

    // When robo-buy is toggled
    toggleRoboBuy(enabled: boolean) {
        this.#player.toggleRoboBuy(enabled);
    }

    // getters:
    get roboBuyState() {
        return this.#player.roboBuyState;
    }

    get player() {
        return this.#player;
    }

    get playerView() {
        return this.#playerView;
    }
    get upgrades() {
        return Upgrade.getAllUpgrades();
    }
    get buildings() {
        return Building.getAllBuildings();
    }
}
