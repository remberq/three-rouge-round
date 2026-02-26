export function easeInOutQuad(t: number): number {
  if (t < 0.5) return 2 * t * t;
  return 1 - Math.pow(-2 * t + 2, 2) / 2;
}
