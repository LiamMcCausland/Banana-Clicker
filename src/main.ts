import PlayerController from "./controller/player/player-controller";
import LoginView from "./view/player/login-view";
import OutputHandler from "./view/output-handler";

let outputHandler = new OutputHandler();
let playerController = new PlayerController(outputHandler);
let loginView = new LoginView(playerController);
