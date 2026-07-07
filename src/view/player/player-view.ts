import Player from "../../domain/player/player.ts";

export default class PlayerView {
    #player: Player

    constructor(player: Player) {
        this.#player = player;
    }

    notify() {
        document.querySelector("#banana-count")!.textContent = "Bananas: " + this.#player.bananas.toString();
    }
}
