export const UpgradeType = {
    DOUBLE_CLICK: "DOUBLE_CLICK",
    TRIPLE_CLICK: "TRIPLE_CLICK",
} as const;

export type UpgradeType = typeof UpgradeType[keyof typeof UpgradeType];
