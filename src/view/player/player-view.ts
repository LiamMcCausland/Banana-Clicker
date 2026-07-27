import Player from "../../domain/player/player.ts";
import PlayerController from "../../controller/player/player-controller.ts";
import Upgrade from "../../domain/upgrade/upgrade.ts"

export default class PlayerView {
    #player: Player
    #playerController: PlayerController;

    constructor(player: Player, playerController: PlayerController) {
        this.#player = player;
        this.#playerController = playerController;
        this.createGameWrapper();
        this.renderGamePanel();
        this.renderUpgradePanel();
        this.renderUpgrades();
        this.renderStore();
    }

    purchase(upgrade: Upgrade) {

        try {
            this.#playerController.purchase(upgrade);
        } catch (e: any) {
            let dialogPopUp = document.createElement('dialog');
            const app = document.getElementById("app")!;
            dialogPopUp.className = "popup-message";
            dialogPopUp.textContent = e.message;
            app.appendChild(dialogPopUp);

            let closeButton = document.createElement('button');
            closeButton.className = "close-button";
            closeButton.textContent = "Close";
            dialogPopUp.appendChild(closeButton);

            closeButton.addEventListener('click', () => {dialogPopUp.close();});

            dialogPopUp.showModal();
        }
    }

    createGameWrapper() {
        const app = document.getElementById("app")!;
        const gameWrapper = document.createElement("div");
        gameWrapper.className = "game-wrapper";
        app.appendChild(gameWrapper);

    }

    renderUpgradePanel() {
        const gameWrapper = document.querySelector('.game-wrapper')!;
        const upgradePanel = document.createElement('div');
        upgradePanel.className = 'upgrades-panel';
        upgradePanel.innerHTML = `
        <h2 class="upgrades-title">Upgrades</h2>
        <div id="upgrades-list" class="upgrades-list">
        </div>
    `;
        gameWrapper.appendChild(upgradePanel);
    }

    renderGamePanel() {
        const playerPanel = document.createElement("div");
        const mainContainer = document.querySelector(".game-wrapper")!;
        mainContainer.innerHTML = `      <div class="game-main">
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
                upgradeElement.textContent = `x${upgrade.modifier}`;
                document.querySelector("#purchased-upgrades")!.appendChild(upgradeElement);
            });
        }
    }

    renderStore() {

        const container = document.querySelector('#upgrades-list')!;
        container.innerHTML = '';

        for (const upgrade of this.#playerController.upgrades) {
            if (!this.#player.upgrades.includes(upgrade)) {
                const button = document.createElement('button');
                button.className = 'upgrade-item';
                button.innerHTML = `
      <img src="src/assets/banana.png" alt="upgrade" class="upgrade-icon" />
      <div class="upgrade-info">
        <div class="upgrade-name">${upgrade.name}</div>
        <div class="upgrade-desc">+${upgrade.modifier} bananas per click</div>
      </div>
      <div class="upgrade-cost">${upgrade.price}</div>
    `;

                button.addEventListener('click', () => this.purchase(upgrade));

                container.appendChild(button);
            }
        }
    }

    notify() {
        // Update banana count
        document.querySelector("#banana-count")!.textContent = "Bananas: " + this.#player.bananas.toString();

        this.renderUpgrades();

        // Update upgrades available
        this.renderStore();
    }
}
