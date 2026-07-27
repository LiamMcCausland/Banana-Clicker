import PlayerController from "./controller/player/player-controller";
import LoginView from "./view/player/login-view";

let playerController = new PlayerController();

let loginView = new LoginView(playerController);
