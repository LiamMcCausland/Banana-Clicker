import Player from "../../domain/player/player.ts";
import PlayerView from "../../view/player/player-view.ts";
import Upgrade from "../../domain/upgrade/upgrade.ts";

export default class PlayerController {
    #player!: Player;
    #playerView!: PlayerView;
    #upgrades: Upgrade[];


    constructor() {
        this.#upgrades = [];
        this.#loadUpgrades();
    }

    async login(username: string, password: string) {
        this.#player = await Player.login(username, password);

        this.#playerView = new PlayerView(
            this.#player,
            this
        );

        this.#player.registerListener(this.#playerView);
        this.#player.notifyAll();
    }

    async register(username: string, password: string) {
        this.#player = await Player.register(username, password);
        
        this.#playerView = new PlayerView(
            this.#player,
            this
        );

        this.#player.registerListener(this.#playerView);
        this.#player.notifyAll();
    }


    async #loadUpgrades() {
        this.#upgrades = await Upgrade.getAllUpgrades();
    }


    get upgrades(): Upgrade[] {
        return this.#upgrades;
    }


    // Called when button is clicked
    click() {
        this.#player.click();
    }

    // When upgrade is chosen
    purchase(upgrade: Upgrade) {
        this.#player.purchaseUpgrade(upgrade);
    }

    player() {
        return this.#player;
    }

    playerView() {
        return this.#playerView;
    }
}
