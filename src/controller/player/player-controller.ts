import Player  from "../../domain/player/player.ts";
import PlayerView from "../../view/player/player-view.ts";
import Upgrade from "../../domain/upgrade/upgrade.ts";

export default class PlayerController {
    #player: Player;
    #playerView: PlayerView;
    
    constructor() {
        this.#player = new Player();
        this.#playerView = new PlayerView(this.#player, this);
        this.#player.registerListener(this.#playerView);
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
