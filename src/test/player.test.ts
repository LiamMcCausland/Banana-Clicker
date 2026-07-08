import { expect, test } from 'vitest'
import Player from '../domain/player/player.ts'
import Upgrade from '../domain/upgrade/upgrade.ts'
import { UpgradeType } from '../domain/upgrade/upgrade-type.ts'

// Test that the player starts with 0 bananas
test('Player starts with 0 bananas', () => {
    const player = new Player();
    expect(player.bananas).toBe(0);
});

test('Player can click to gain bananas', () => {
    const player = new Player();
    player.click();
    expect(player.bananas).toBe(1);
});

test('Player can click multiple times to gain bananas', () => {
    const player = new Player();
    player.click();
    player.click();
    expect(player.bananas).toBe(2);
});

test('Player can have upgrades', () => {
    const player = new Player();
    expect(player.upgrades).toEqual([]);
});

test('Player can have upgrades added', () => {
    const player = new Player();
    const upgrade = new Upgrade(UpgradeType.DOUBLE_CLICK);
    player.upgrades.push(upgrade);
    expect(player.upgrades).toContain(upgrade);
});

test('Player upgrades modify bananas gained per click', () => {
    const player = new Player();
    const upgrade = new Upgrade(UpgradeType.DOUBLE_CLICK);
    player.upgrades.push(upgrade);
    player.click();
    expect(player.bananas).toBe(2); // assuming DOUBLE_CLICK modifier = 2
});

test('Setting negative bananas throws', () => {
    const player = new Player();
    expect(() => { player.bananas = -1; }).toThrow();
});


