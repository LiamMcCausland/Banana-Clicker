import PlayerController from "./controller/player/player-controller";
import StoreController from "./controller/store/store-controller";

//TODO: Move to some sort of view module
const app = document.getElementById("app")!;
const gameWrapper = document.createElement("div");
gameWrapper.className = "game-wrapper";
app.appendChild(gameWrapper);

// listen to banana button
let playerController = new PlayerController();
let storeController = new StoreController();
storeController.setPlayer(playerController.player());

//TODO: ensures this is best practice
storeController.registerListener(playerController.playerView());





