export const radius = {
  sm: 11,
  md: 13,
  lg: 15,
  pill: 999,
} as const;

export type RadiusToken = keyof typeof radius;
