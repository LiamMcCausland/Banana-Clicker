import Player  from "../../domain/player/player.ts";
import PlayerView from "../../view/player/player-view.ts";

export default class PlayerController {
    #player: Player;
    #playerView: PlayerView;
    
    constructor() {
        this.#player = new Player();
        this.#playerView = new PlayerView(this.#player);
        this.#player.registerListener(this.#playerView);
    }

    // Called when button is clicked
    click() {
        this.#player.click();
    }

    player() {
        return this.#player;
    }

    playerView() {
        return this.#playerView;
    }
}
