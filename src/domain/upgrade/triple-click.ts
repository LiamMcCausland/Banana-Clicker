import Upgrade from "./upgrade.ts"

export default class TripleClickUpgrade extends Upgrade {

    constructor() {
        super(
            "Triple Click",
            100,
            3
        );
    }
}
