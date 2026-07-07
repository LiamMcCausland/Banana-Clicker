import PlayerController from "./controller/player/player-controller";
import StoreController from "./controller/store/store-controller";

// listen to banana button
let playerController = new PlayerController();
let storeController = new StoreController();
storeController.setPlayer(playerController.player());

//TODO: ensures this is best practice
storeController.registerListener(playerController.playerView());


// Banana button click event listener
document.querySelector("#banana-button")!.addEventListener("click", () => playerController.click());

console.log(playerController.player());





