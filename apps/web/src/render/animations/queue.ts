import type { Ticker } from 'pixi.js';

export type AnimStep = {
  name: string;
  run: (ticker: Ticker) => Promise<void>;
};

export class AnimationQueue {
  private running = false;

  get isRunning() {
    return this.running;
  }

  async runSequential(ticker: Ticker, steps: AnimStep[]): Promise<void> {
    if (this.running) throw new Error('AnimationQueue already running');
    this.running = true;

    try {
      for (const s of steps) {
        await s.run(ticker);
      }
    } finally {
      this.running = false;
    }
  }
}

export function tween(params: {
  ticker: Ticker;
  durationMs: number;
  onUpdate: (t01: number) => void;
}): Promise<void> {
  const { ticker, durationMs, onUpdate } = params;

  return new Promise((resolve) => {
    const start = performance.now();

    const fn = () => {
      const now = performance.now();
      const t01 = Math.min(1, (now - start) / durationMs);
      onUpdate(t01);
      if (t01 >= 1) {
        ticker.remove(fn);
        resolve();
      }
    };

    ticker.add(fn);
  });
}
