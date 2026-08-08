import { expect, test } from 'vitest'
import Player from '../domain/player/player.ts'
import Upgrade from '../domain/upgrade/upgrade.ts'
import Building from '../domain/building/building.ts'
import ChainLoader from '../domain/player/chain-loader.ts'
import db from '../domain/persistence/connection.ts'

const username = "testuser";
const passwordHash = "testhash";
const passwordSalt = "testsalt";

const chainLoader = { predict: async () => undefined } as unknown as ChainLoader;

test('Player starts with 0 bananas', () => {
    const player = new Player(username, passwordHash, passwordSalt, 0, [], [], chainLoader);
    expect(player.bananas).toBe(0);
});

test('Player can click to gain bananas', () => {
    const player = new Player(username, passwordHash, passwordSalt, 0, [], [], chainLoader);
    player.click();
    expect(player.bananas).toBe(1);
});

test('Player can click multiple times to gain bananas', () => {
    const player = new Player(username, passwordHash, passwordSalt, 0, [], [], chainLoader);
    player.click();
    player.click();
    expect(player.bananas).toBe(2);
});

test('Player can have upgrades', () => {
    const player = new Player(username, passwordHash, passwordSalt, 0, [], [], chainLoader);
    expect(player.upgrades).toEqual([]);
});

test('Player can have upgrades added', () => {
    const player = new Player(username, passwordHash, passwordSalt, 0, [], [], chainLoader);
    const upgrade = new Upgrade("Double Click", "Doubles bananas per click", 10, 2);
    player.upgrades.push(upgrade);
    expect(player.upgrades).toContain(upgrade);
});

test('Player upgrades modify bananas gained per click', () => {
    const player = new Player(username, passwordHash, passwordSalt, 0, [], [], chainLoader);
    const upgrade = new Upgrade("Double Click", "Doubles bananas per click", 10, 2);
    player.upgrades.push(upgrade);
    player.click();
    expect(player.bananas).toBe(2);
});

test('Setting negative bananas throws', () => {
    const player = new Player(username, passwordHash, passwordSalt, 0, [], [], chainLoader);
    expect(() => { player.bananas = -1; }).toThrow();
});

test('Player notifies listeners on click', () => {
    const player = new Player(username, passwordHash, passwordSalt, 0, [], [], chainLoader);
    let notified = false;
    player.registerListener({ notify: () => { notified = true; } });
    player.click();
    expect(notified).toBe(true);
});

test('Player can purchase an upgrade with enough bananas', () => {
    const player = new Player(username, passwordHash, passwordSalt, 0, [], [], chainLoader);
    const upgrade = new Upgrade("Double Click", "Doubles bananas per click", 10, 2);
    player.bananas = upgrade.price;
    const success = player.purchaseUpgrade(upgrade);
    expect(success).toBe(true);
    expect(player.upgrades).toContain(upgrade);
    expect(player.bananas).toBe(0);
});

test('Purchasing an upgrade without enough bananas throws', () => {
    const player = new Player(username, passwordHash, passwordSalt, 0, [], [], chainLoader);
    const upgrade = new Upgrade("Double Click", "Doubles bananas per click", 10, 2);
    player.bananas = upgrade.price - 1;
    expect(() => { player.purchaseUpgrade(upgrade); }).toThrow();
    expect(player.upgrades).not.toContain(upgrade);
    expect(player.bananas).toBe(upgrade.price - 1);
});

test('Purchasing the same upgrade twice throws on the second attempt', () => {
    const player = new Player(username, passwordHash, passwordSalt, 0, [], [], chainLoader);
    const upgrade = new Upgrade("Double Click", "Doubles bananas per click", 10, 2);
    player.bananas = upgrade.price * 2;
    player.purchaseUpgrade(upgrade);
    expect(() => { player.purchaseUpgrade(upgrade); }).toThrow();
});

test('Purchasing notifies listeners', () => {
    const player = new Player(username, passwordHash, passwordSalt, 0, [], [], chainLoader);
    const upgrade = new Upgrade("Double Click", "Doubles bananas per click", 10, 2);
    player.bananas = upgrade.price;
    let notified = false;
    player.registerListener({ notify: () => { notified = true; } });
    player.purchaseUpgrade(upgrade);
    expect(notified).toBe(true);
});

test('Player can have buildings', () => {
    const player = new Player(username, passwordHash, passwordSalt, 0, [], [], chainLoader);
    expect(player.buildings).toEqual([]);
});

test('Player can purchase a building with enough bananas', () => {
    const player = new Player(username, passwordHash, passwordSalt, 0, [], [], chainLoader);
    const building = new Building("Acuminata", "A sturdy banana tree", 100, 1);
    player.bananas = building.price;
    const success = player.purchaseBuilding(building);
    expect(success).toBe(true);
    expect(player.buildings).toContain(building);
    expect(player.bananas).toBe(0);
});

test('Purchasing a building without enough bananas throws', () => {
    const player = new Player(username, passwordHash, passwordSalt, 0, [], [], chainLoader);
    const building = new Building("Acuminata", "A sturdy banana tree", 100, 1);
    player.bananas = building.price - 1;
    expect(() => { player.purchaseBuilding(building); }).toThrow();
    expect(player.buildings).not.toContain(building);
    expect(player.bananas).toBe(building.price - 1);
});

test('Buildings generate bananas when player ticks', () => {
    const building = new Building("Acuminata", "A sturdy banana tree", 100, 1);
    const player = new Player(username, passwordHash, passwordSalt, 0, [], [building], chainLoader);
    player.tick();
    expect(player.bananas).toBe(1);
});

test('Multiple buildings generate their combined bananas per second', () => {
    const building1 = new Building("Acuminata", "A sturdy banana tree", 100, 1);
    const building2 = new Building("Balbisiana", "A productive banana tree", 200, 2);
    const player = new Player(username, passwordHash, passwordSalt, 0, [], [building1, building2], chainLoader);
    player.tick();
    expect(player.bananas).toBe(3);
});

test('register player with valid username and password', async () => {
    const username = "newuser";
    const password = "newpassword";
    const player = await Player.register(username, password, chainLoader);
    const result = await db().query('select * from player where username = $1', [username]);
    expect(result.rows.length).toBe(1);
    expect(result.rows[0].username).toBe(username);
    expect(player.username).toBe(username);
    expect(player.bananas).toBe(0);
});

test('register player and login with correct password', async () => {
    const username = "loginuser";
    const password = "loginpassword";
    await Player.register(username, password, chainLoader);
    const result = await db().query('select * from player where username = $1', [username]);
    expect(result.rows.length).toBe(1);
    expect(result.rows[0].username).toBe(username);
    const loggedInPlayer = await Player.login(username, password, chainLoader);
    expect(loggedInPlayer.username).toBe(username);
});

test('robo-buy returns a prediction', async () => {
    const chainLoder = await ChainLoader.create('../../training/output_matrix.csv');
    const player = new Player(username, passwordHash, passwordSalt, 0, [], [], chainLoder);
    player.toggleRoboBuy(true);
    player.tick();
    const nextChoice = await player.roboBuyState;
    expect(nextChoice).toBeDefined();
});

test('login with incorrect password throws', async () => {
    const username = "wrongpassuser";
    const password = "correctpassword";
    await Player.register(username, password, chainLoader);
    await expect(Player.login(username, "wrongpassword", chainLoader)).rejects.toThrow();
});
    
