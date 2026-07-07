import Store from "../../domain/store/store";
import Upgrade from "../../domain/upgrade/upgrade";
import Player from "../../domain/player/player";

export default class StoreView {
    #store: Store;
    #player: Player;

    constructor(Store: Store) {
        this.#store = Store;
        this.#player = null as any;
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

            button.addEventListener('click', () => this.#store.purchase(this.#player, upgrade));

            container.appendChild(button);
        });
    }


    notify() {
        if (this.#player) {
            this.renderStore();
        }
    }
}

