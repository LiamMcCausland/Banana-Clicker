import { expect, test } from 'vitest'
import Store from '../domain/store/store.ts'
import Player from '../domain/player/player.ts'
import Upgrade from '../domain/upgrade/upgrade.ts'
import { UpgradeType } from '../domain/upgrade/upgrade-type.ts'

test('Store initializes with one shop item per upgrade type', () => {
    const store = new Store();
    const typeCount = Object.keys(UpgradeType).length;
    expect(store.shopItems.length).toBe(typeCount);
});

test('Store shop items contain expected upgrade types', () => {
    const store = new Store();
    const types = store.shopItems.map(item => item.type);
    expect(types).toContain(UpgradeType.DOUBLE_CLICK);
    expect(types).toContain(UpgradeType.TRIPLE_CLICK);
});

test('Player can purchase an upgrade if they have enough bananas', () => {
    const store = new Store();
    const player = new Player();
    player.bananas = 50;

    const upgrade = store.shopItems.find(i => i.type === UpgradeType.DOUBLE_CLICK)!;
    store.purchase(player, upgrade);

    expect(player.bananas).toBe(0);
    expect(player.upgrades).toContain(upgrade);
});

test('Purchasing removes the upgrade from the shop', () => {
    const store = new Store();
    const player = new Player();
    player.bananas = 50;

    const upgrade = store.shopItems.find(i => i.type === UpgradeType.DOUBLE_CLICK)!;
    store.purchase(player, upgrade);

    expect(store.shopItems).not.toContain(upgrade);
});

test('Purchasing throws if player does not have enough bananas', () => {
    const store = new Store();
    const player = new Player();
    player.bananas = 10;

    const upgrade = store.shopItems.find(i => i.type === UpgradeType.DOUBLE_CLICK)!;

    expect(() => store.purchase(player, upgrade)).toThrow("Not enough bananas to purchase this upgrade");
});

test('Failed purchase does not remove item from shop or change player state', () => {
    const store = new Store();
    const player = new Player();
    player.bananas = 10;

    const upgrade = store.shopItems.find(i => i.type === UpgradeType.DOUBLE_CLICK)!;

    expect(() => store.purchase(player, upgrade)).toThrow();
    expect(store.shopItems).toContain(upgrade);
    expect(player.bananas).toBe(10);
    expect(player.upgrades).not.toContain(upgrade);
});

test('Purchasing throws if upgrade is not found in shop', () => {
    const store = new Store();
    const player = new Player();
    player.bananas = 100;

    // an upgrade instance not sourced from the shop's own array
    const foreignUpgrade = new Upgrade(UpgradeType.TRIPLE_CLICK);
    // simulate it already being purchased/removed elsewhere
    const alreadyBought = store.shopItems.find(i => i.type === UpgradeType.TRIPLE_CLICK)!;
    store.purchase(player, alreadyBought);

    expect(() => store.purchase(player, foreignUpgrade)).toThrow("Upgrade not found in shop");
});
