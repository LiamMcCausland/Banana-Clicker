import { expect, test } from 'vitest'
import Building from '../domain/building/building.ts'

test('Acuminata building has correct properties', async () => {
    const buildings = await Building.getAllBuildings();
    const building = buildings[0];

    expect(building.name).toBe("Acuminata");
    expect(building.price).toBe(100);
    expect(building.bps).toBe(1);
});

test('Balbisiana building has correct properties', async () => {
    const buildings = await Building.getAllBuildings();
    const building = buildings[1];

    expect(building.name).toBe("Balbisiana");
    expect(building.price).toBe(500);
    expect(building.bps).toBe(5);
});

test('Bananas per second is always greater than or equal to 1', async () => {
    const buildings = await Building.getAllBuildings();
    const building = buildings[0];

    expect(building.bps).toBeGreaterThanOrEqual(1);
});

test('Price is always greater than or equal to 0', async () => {
    const buildings = await Building.getAllBuildings();
    const building = buildings[0];

    expect(building.price).toBeGreaterThanOrEqual(0);
});

test('login ')
