import { expect, test } from 'vitest'
import Upgrade from '../domain/upgrade/upgrade.ts'

test('DOUBLE_CLICK upgrade has correct properties', () => {
    const upgrade = Upgrade.getAllUpgrades()[0];
    expect(upgrade.modifier).toBe(2);
    expect(upgrade.price).toBe(50);
    expect(upgrade.name).toBe("Double Click");
});

test('TRIPLE_CLICK upgrade has correct properties', () => {
    const upgrade = Upgrade.getAllUpgrades()[1];
    expect(upgrade.modifier).toBe(3);
    expect(upgrade.price).toBe(100);
    expect(upgrade.name).toBe("Triple Click");
});

test('Modifier is always greater than or equal to 1', () => {
    const upgrade = Upgrade.getAllUpgrades()[0];
    expect(upgrade.modifier).toBeGreaterThanOrEqual(1);
});

test('Price is always greater than 0', () => {
    const upgrade = Upgrade.getAllUpgrades()[0];
    expect(upgrade.price).toBeGreaterThan(0);
});
