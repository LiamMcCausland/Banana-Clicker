import Player from "../../domain/player/player.ts";
import PlayerView from "../../view/player/player-view.ts";
import Upgrade from "../../domain/upgrade/upgrade.ts";
import Building from "../../domain/building/building.ts";
import OutputHandler from "../../view/output-handler.ts";

export default class PlayerController {
    #player!: Player;
    #playerView!: PlayerView;
    #output: OutputHandler;

    constructor(output: OutputHandler) {
        this.#output = output;

        setInterval(() => this.tick(), 1000);
    }

    async login(username: string, password: string) {
        this.#player = await Player.login(username, password);

        this.#playerView = new PlayerView(
            this.#player,
            this,
            this.#output
        );

        this.#player.registerListener(this.#playerView);
        this.#player.notifyAll();
    }

    async register(username: string, password: string) {
        this.#player = await Player.register(username, password);

        this.#playerView = new PlayerView(
            this.#player,
            this,
            this.#output
        );

        this.#player.registerListener(this.#playerView);
        this.#player.notifyAll();
    }

    click() {
        this.#player.click();
    }

    tick() {
        this.#player.tick();
    }

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

    purchaseBuilding(building: Building) {
        this.#player.purchaseBuilding(building);
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
