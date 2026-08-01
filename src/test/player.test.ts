import { expect, test } from 'vitest'
import Player from '../domain/player/player.ts'
import Upgrade from '../domain/upgrade/upgrade.ts'
const username = "testuser";
const passwordHash = "testhash";
const passwordSalt = "testsalt";

// Test that the player starts with 0 bananas
test('Player starts with 0 bananas', () => {
    const player = new Player(username, passwordHash, passwordSalt, 0, [], []);
    expect(player.bananas).toBe(0);
});

test('Player can click to gain bananas', () => {
    const player = new Player(username, passwordHash, passwordSalt, 0, [], []);
    player.click();
    expect(player.bananas).toBe(1);
});

test('Player can click multiple times to gain bananas', () => {
    const player = new Player(username, passwordHash, passwordSalt, 0, [], []);
    player.click();
    player.click();
    expect(player.bananas).toBe(2);
});

test('Player can have upgrades', () => {
    const player = new Player(username, passwordHash, passwordSalt, 0, [], []);
    expect(player.upgrades).toEqual([]);
});

test('Player can have upgrades added', () => {
    const player = new Player(username, passwordHash, passwordSalt, 0, [], []);
    const upgrade = new Upgrade("Double Click", "Doubles bananas per click", 10, 2);
    player.upgrades.push(upgrade);
    expect(player.upgrades).toContain(upgrade);
});

test('Player upgrades modify bananas gained per click', () => {
    const player = new Player(username, passwordHash, passwordSalt, 0, [], []);
    const upgrade = new Upgrade("Double Click", "Doubles bananas per click", 10, 2);
    player.upgrades.push(upgrade);
    player.click();
    expect(player.bananas).toBe(2); 
});

test('Setting negative bananas throws', () => {
    const player = new Player(username, passwordHash, passwordSalt, 0, [], []);
    expect(() => { player.bananas = -1; }).toThrow();
});

test('Player notifies listeners on click', () => {
    const player = new Player(username, passwordHash, passwordSalt, 0, [], []);
    let notified = false;
    player.registerListener({
        notify: () => { notified = true; }
    });
    player.click();
    expect(notified).toBe(true);
});

test('Player can purchase an upgrade with enough bananas', () => {
    const player = new Player(username, passwordHash, passwordSalt, 0, [], []);
    const upgrade = new Upgrade("Double Click", "Doubles bananas per click", 10, 2);
    player.bananas = upgrade.price;
 
    const success = player.purchaseUpgrade(upgrade);
 
    expect(success).toBe(true);
    expect(player.upgrades).toContain(upgrade);
});

test('Purchasing an upgrade without enough bananas throws', () => {
    const player = new Player(username, passwordHash, passwordSalt, 0, [], []);
    const upgrade = new Upgrade("Double Click", "Doubles bananas per click", 10, 2);
    player.bananas = upgrade.price - 1;
 
    expect(() => { player.purchaseUpgrade(upgrade); }).toThrow();
    expect(player.upgrades).not.toContain(upgrade);
    expect(player.bananas).toBe(upgrade.price - 1);
});

test('Purchasing the same upgrade twice throws on the second attempt', () => {
    const player = new Player(username, passwordHash, passwordSalt, 0, [], []);
    const upgrade = new Upgrade("Double Click", "Doubles bananas per click", 10, 2);
    player.bananas = upgrade.price * 2;
 
    player.purchaseUpgrade(upgrade);
 
    expect(() => { player.purchaseUpgrade(upgrade); }).toThrow();
});

test('Purchasing notifies listeners', () => {
    const player = new Player(username, passwordHash, passwordSalt, 0, [], []);
    const upgrade = new Upgrade("Double Click", "Doubles bananas per click", 10, 2);
    player.bananas = upgrade.price;
 
    let notified = false;
    player.registerListener({
        notify: () => { notified = true; }
    });
 
    player.purchaseUpgrade(upgrade);
 
    expect(notified).toBe(true);
});



