import Player from "../../domain/player/player.ts";
import PlayerView from "../../view/player/player-view.ts";
import Upgrade from "../../domain/upgrade/upgrade.ts";
import Building from "../../domain/building/building.ts";

export default class PlayerController {
    #player!: Player;
    #playerView!: PlayerView;

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


    get upgrades() {
        return Upgrade.getAllUpgrades();
    }

    get buildings() {
        return Building.getAllBuildings();
    }

    click() {
        this.#player.click();
    }

    // When upgrade is chosen
    purchaseUpgrade(upgrade: Upgrade) {
        this.#player.purchaseUpgrade(upgrade);
    }

    purchaseBuilding(building: Building) {
        this.#player.purchaseBuilding(building);
    }
        

    player() {
        return this.#player;
    }

    playerView() {
        return this.#playerView;
    }
}
