// Custom exceptions for player actions:
export class NotEnoughBananasException extends Error {
    constructor(message: string) {
        super(message);
    }
}
export class UpgradeNotFoundException extends Error {
    constructor(message: string) {
        super(message);
    }
}
export class DuplicateUpgradeException extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class AccountNotFoundException extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class BuildingNotFoundException extends Error {
    constructor(message: string) {
        super(message);
    }
}
