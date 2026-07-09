import Player from "../../domain/player/player.ts";
import PlayerController from "../../controller/player/player-controller.ts";

export default class PlayerView {
    #player: Player
    #playerController: PlayerController;
    
    constructor(player: Player, playerController: PlayerController) {
        this.#player = player;
        this.#playerController = playerController;
        this.renderGamePanel();
    }

    renderGamePanel() {
        const playerPanel = document.createElement("div");
        const mainContainer = document.querySelector(".game-wrapper")!;
        playerPanel.id = "game-main";
        playerPanel.innerHTML = `      <div class="game-main">
        <div id="banana-count" class="banana-count">Bananas: 0</div>

        <!-- Purchased upgrades strip -->
        <div id="purchased-upgrades" class="purchased-upgrades">
          <div class="purchased-upgrades-empty">No upgrades purchased yet</div>
        </div>

        <button id="banana-button" class="banana-button">
          <img src="src/assets/banana.png" alt="banana" width="180" height="180" />
        </button>
      </div>`;

        mainContainer.appendChild(playerPanel); 
        document.querySelector("#banana-button")!.addEventListener("click", () => this.#playerController.click());
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
