export type Rng = {
  nextFloat: () => number; // [0, 1)
  nextInt: (maxExclusive: number) => number; // [0, maxExclusive)
  clone: () => Rng;
  getState: () => number; // implementation-defined (uint32)
};

// mulberry32: tiny deterministic PRNG
export function createRng(seed: number): Rng {
  let a = seed >>> 0;

  const nextUint32 = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return (t ^ (t >>> 14)) >>> 0;
  };

  const api: Rng = {
    nextFloat: () => nextUint32() / 2 ** 32,
    nextInt: (maxExclusive: number) => {
      if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
        throw new Error(`maxExclusive must be a positive int, got ${maxExclusive}`);
      }
      return Math.floor(api.nextFloat() * maxExclusive);
    },
    clone: () => createRng(a),
    getState: () => a,
  };

  return api;
}
