import Store from "../../domain/store/store";
import Upgrade from "../../domain/upgrade/upgrade";
import Player from "../../domain/player/player";
import StoreController from "../../controller/store/store-controller";

export default class StoreView {
    #player: Player;
    #store: Store;
    #controller: StoreController;

    constructor(Store: Store, controller: StoreController) {
        this.#player = null as any;
        this.#store = Store;
        this.#controller = controller;
    }

    setPlayer(player: Player) {
        this.#player = player;
        this.renderStore();
    }

    renderStore() {

        const container = document.querySelector('#upgrades-list')!;
        container.innerHTML = '';
        this.#store.shopItems.forEach((upgrade: Upgrade) => {
            const button = document.createElement('button');
            button.className = 'upgrade-item';
            button.dataset.upgrade = upgrade.type.toLowerCase();

            button.innerHTML = `
      <img src="src/assets/banana.png" alt="upgrade" class="upgrade-icon" />
      <div class="upgrade-info">
        <div class="upgrade-name">${upgrade.name}</div>
        <div class="upgrade-desc">+${upgrade.modifier} bananas per click</div>
      </div>
      <div class="upgrade-cost">${upgrade.price}</div>
    `;

            button.addEventListener('click', () => this.#controller.purchase(this.#player, upgrade));

            container.appendChild(button);
        });
    }


    notify() {
        if (this.#player) {
            this.renderStore();
        }
    }
}

