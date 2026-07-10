import Upgrade from "./upgrade.ts"

export default class DoubleClickUpgrade extends Upgrade {

    constructor() {
        super(
            "Double Click",
            50,
            2
        );
    }
}
