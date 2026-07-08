import { expect, test } from 'vitest'
import Upgrade from '../domain/upgrade/upgrade.ts'
import { UpgradeType } from '../domain/upgrade/upgrade-type.ts'

test('DOUBLE_CLICK upgrade has correct properties', () => {
    const upgrade = new Upgrade(UpgradeType.DOUBLE_CLICK);
    expect(upgrade.modifier).toBe(2);
    expect(upgrade.price).toBe(50);
    expect(upgrade.name).toBe("Double Click");
    expect(upgrade.type).toBe(UpgradeType.DOUBLE_CLICK);
});

test('TRIPLE_CLICK upgrade has correct properties', () => {
    const upgrade = new Upgrade(UpgradeType.TRIPLE_CLICK);
    expect(upgrade.modifier).toBe(3);
    expect(upgrade.price).toBe(100);
    expect(upgrade.name).toBe("Triple Click");
    expect(upgrade.type).toBe(UpgradeType.TRIPLE_CLICK);
});

test('Modifier is always greater than or equal to 1', () => {
    const upgrade = new Upgrade(UpgradeType.DOUBLE_CLICK);
    expect(upgrade.modifier).toBeGreaterThanOrEqual(1);
});

test('Price is always greater than 0', () => {
    const upgrade = new Upgrade(UpgradeType.TRIPLE_CLICK);
    expect(upgrade.price).toBeGreaterThan(0);
});
