import Player from "../../domain/player/player.ts";
import PlayerController from "../../controller/player/player-controller.ts";
import Upgrade from "../../domain/upgrade/upgrade.ts"
import Building from "../../domain/building/building.ts"
import OutputHandler from "../../view/output-handler.ts";

export default class PlayerView {
    #player: Player
    #playerController: PlayerController;
    #output: OutputHandler;

    constructor(player: Player, playerController: PlayerController, output: OutputHandler) {
        this.#player = player;
        this.#playerController = playerController;
        this.#output = output;

        this.createGameWrapper();
    }

    renderGame() {
        this.renderGamePanel();
        this.renderStorePanel();
        this.renderPurchasedUpgrades();
        this.renderPurchasedBuildings();
        this.renderStore();
        this.renderSaveButton();
    }

    purchase(item: any): void {

        try {
            if (item instanceof Upgrade) {
                this.#playerController.purchaseUpgrade(item);
            }
            else if (item instanceof Building) {
                this.#playerController.purchaseBuilding(item);
            }
        } catch (e: any) {
            this.#output.displayMessage(e.message);
        }
    }



    createGameWrapper() {
        const app = document.getElementById("app")!;
        const gameWrapper = document.createElement("div");
        gameWrapper.className = "game-wrapper";
        app.appendChild(gameWrapper);

    }


    renderStorePanel() {
        const gameWrapper = document.querySelector('.game-wrapper')!;
        const upgradePanel = document.createElement('div');
        upgradePanel.className = 'upgrades-panel';
        upgradePanel.innerHTML = `
        <h2 class="upgrades-title">Upgrades</h2>
        <div id="upgrades-list" class="upgrades-list">
        </div>
<h2 class="upgrades-title">Buildings</h2>
        <div id="buildings-list" class="upgrades-list">
    `;
        gameWrapper.appendChild(upgradePanel);
    }

    // renders the main game panel with banana count, purchased upgrades, and banana button
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
        document.querySelector("#banana-button")!.addEventListener("click", () => { this.#playerController.click() });
    }


    // renders the purhcased upgrades under the banana count
    renderPurchasedUpgrades() {
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

    renderPurchasedBuildings() {
        if (this.#player.buildings && this.#player.buildings.length > 0) {
            let gameMain = document.querySelector(".game-main")!;
            let buildingsContainer = document.createElement("div");
            buildingsContainer.id = "purchased-buildings";
            buildingsContainer.className = "purchased-buildings";

            for (const building of this.#player.buildings) {
                const buildingElement = document.createElement("img");
                if (building.name === "Acuminata") {
                    buildingElement.src = "src/assets/batree.png";
                } else {
                    buildingElement.src = "src/assets/btree.png";
                }
                buildingElement.alt = building.name;
                buildingElement.className = "purchased-building";
                buildingsContainer.appendChild(buildingElement);
            }

            gameMain.appendChild(buildingsContainer);
        }
    }


    renderStore() {

        const container = document.querySelector('#upgrades-list')!;
        container.innerHTML = '';

        // Render available upgrades
        for (const upgrade of this.#playerController.upgrades) {
            if (!this.#player.upgrades.some(u => u.name === upgrade.name)) {
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

        // Render available buildings
        const buildingContainer = document.querySelector('#buildings-list')!;
        buildingContainer.innerHTML = '';

        for (const building of this.#playerController.buildings) {

            // Grab amount owned
            let owned = this.#player.buildings.filter(b => b.name === building.name).length;
            const button = document.createElement('button');
            button.className = 'upgrade-item';
            button.innerHTML = `
      <div class="upgrade-info">
        <div class="upgrade-name">${building.name}</div>
<div class="upgrade-desc">+${building.bps} bananas per second</div>
      </div>
      <div class="upgrade-cost">${building.price}</div>
<div class="upgrade-name">Owned: ${owned}</div>
    `;

            let imgElement = document.createElement('img');
            imgElement.alt = building.name;
            imgElement.className = "upgrade-icon";

            if (building.name === "Acuminata") {
                imgElement.src = "src/assets/batree.png";
            } else {
                imgElement.src = "src/assets/btree.png";
            }
            button.prepend(imgElement);


            button.addEventListener('click', () => this.purchase(building));

            buildingContainer.appendChild(button);
        }
    }

    renderSaveButton() {
        const saveButton = document.createElement('button');
        saveButton.id = 'save-button';
        saveButton.textContent = 'Save Game';
        saveButton.className = 'save-button';
        saveButton.addEventListener('click', async () => { await this.#playerController.save(); });
        document.querySelector('.game-main')!.appendChild(saveButton);
    }

    notify() {
        console.log("refreshing game.");

        this.renderGame();
        document.querySelector("#banana-count")!.textContent = "Bananas: " + this.#player.bananas.toString();
    }
}
