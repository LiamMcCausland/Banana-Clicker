import { Player}  from "../../domain/player/player.ts";

export default class PlayerController {
    private player: Player;
    
    constructor(player: Player) {
        this.player = player;
    }

    public click() {
        this.player.click();
    }
}
