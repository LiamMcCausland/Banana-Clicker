import PlayerController from "./controller/player/player-controller";
import LoginView from "./view/player/login-view";
import OutputHandler from "./view/output-handler";
import ChainLoader from "./domain/player/chain-loader";

const trainedModelPath = "../training/output_matrix.csv";

// model loaded on startup
let chainLoader = await ChainLoader.create(trainedModelPath);
let outputHandler = new OutputHandler();
let playerController = new PlayerController(outputHandler, chainLoader);
let loginView = new LoginView(playerController);
