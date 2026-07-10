import { expect, test } from 'vitest'
import TripleClickUpgrade from '../domain/upgrade/triple-click.ts';
import DoubleClickUpgrade from '../domain/upgrade/double-click.ts';

test('DOUBLE_CLICK upgrade has correct properties', () => {
    const upgrade = new DoubleClickUpgrade();
    expect(upgrade.modifier).toBe(2);
    expect(upgrade.price).toBe(50);
    expect(upgrade.name).toBe("Double Click");
});

test('TRIPLE_CLICK upgrade has correct properties', () => {
    const upgrade = new TripleClickUpgrade();
    expect(upgrade.modifier).toBe(3);
    expect(upgrade.price).toBe(100);
    expect(upgrade.name).toBe("Triple Click");
});

test('Modifier is always greater than or equal to 1', () => {
    const upgrade = new DoubleClickUpgrade();
    expect(upgrade.modifier).toBeGreaterThanOrEqual(1);
});

test('Price is always greater than 0', () => {
    const upgrade = new TripleClickUpgrade();
    expect(upgrade.price).toBeGreaterThan(0);
});
