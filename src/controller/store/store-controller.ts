import Store from "../../domain/store/store";
import StoreView from "../../view/store/store-view";
import Upgrade from "../../domain/upgrade/upgrade";
import Player from "../../domain/player/player";


export default class StoreController {
    #store: Store;
    #storeView: StoreView;

    constructor() {
        this.#store = new Store();
        this.#storeView = new StoreView(this.#store);
        this.#store.registerListener(this.#storeView);
    }

    purchase(player: Player, upgrade: Upgrade) {
        this.#store.purchase(player, upgrade);
    }

    setPlayer(player: Player) {
        this.#storeView.setPlayer(player);
    }
}

    
    
