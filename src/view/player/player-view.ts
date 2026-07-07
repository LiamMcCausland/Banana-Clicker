import Player from "../../domain/player/player.ts";

export default class PlayerView {
    #player: Player

    constructor(player: Player) {
        this.#player = player;
    }

    renderUpgrades() {
        if (this.#player.upgrades && this.#player.upgrades.length > 0) {

            document.querySelector("#purchased-upgrades")!.innerHTML = "";

            this.#player.upgrades.forEach((upgrade) => {
                const upgradeElement = document.createElement("div");
                upgradeElement.className = "purchased-upgrade";
                upgradeElement.textContent = `${upgrade.name}`;
                document.querySelector("#purchased-upgrades")!.appendChild(upgradeElement);
            });
        }
    }

    notify() {
        document.querySelector("#banana-count")!.textContent = "Bananas: " + this.#player.bananas.toString();
        this.renderUpgrades();
    }
}
