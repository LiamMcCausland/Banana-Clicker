import { expect, test } from 'vitest'
import Building from '../domain/building/building.ts'

test('Acuminata building has correct properties', () => {
    const building = Building.getAllBuildings()[0];
    expect(building.name).toBe("Acuminata");
    expect(building.description).toBe("A sturdy banana tree");
    expect(building.price).toBe(100);
    expect(building.bps).toBe(1);
});
test('Balbisiana building has correct properties', () => {
    const building = Building.getAllBuildings()[1];
    expect(building.name).toBe("Balbisiana");
    expect(building.description).toBe("A productive banana tree");
    expect(building.price).toBe(200);
    expect(building.bps).toBe(2);
});
test('Bananas per second is always greater than or equal to 1', () => {
    const building = Building.getAllBuildings()[0];
    expect(building.bps).toBeGreaterThanOrEqual(1);
});
test('Price is always greater than or equal to 0', () => {
    const building = Building.getAllBuildings()[0];
    expect(building.price).toBeGreaterThanOrEqual(0);
});
