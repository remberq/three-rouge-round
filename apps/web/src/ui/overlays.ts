import './overlays.css';

import { clearRun, loadRun, makeEmptyRunState, RUN_SAVE_KEY, saveRun } from '../game/run';
import type { RunState } from '../game/run';
import { generateRewardChoices, UPGRADE_DEF_BY_ID } from '../game/upgrades';

export type OverlayApi = {
  mount(host: HTMLElement): void;
  unmount(): void;
  render(state: RunState): void;
  isBlockingInput(): boolean;
};

type Handlers = {
  onNewRun: (seed?: number) => void;
  onContinue: () => void;
  onReset: () => void;
  onChooseUpgrade: (upgradeId: string) => void;
  onNextBattle: () => void;
  onStartNewAfterEnd: () => void;
};

export function createOverlays(handlers: Handlers): OverlayApi {
  const root = document.createElement('div');
  root.className = 'overlay-root';

  let current: RunState | null = null;
  let mounted = false;

  const makeButton = (label: string, opts: { primary?: boolean; disabled?: boolean } = {}) => {
    const b = document.createElement('button');
    b.textContent = label;
    if (opts.primary) b.classList.add('primary');
    if (opts.disabled) b.disabled = true;
    return b;
  };

  const setCard = (card: HTMLElement | null) => {
    root.replaceChildren();
    if (card) root.appendChild(card);
  };

  const hasSave = (): boolean => {
    try {
      return window.localStorage.getItem(RUN_SAVE_KEY) != null;
    } catch {
      return false;
    }
  };

  const renderStart = () => {
    const card = document.createElement('div');
    card.className = 'overlay-card';
    card.setAttribute('data-screen', 'start');

    const h = document.createElement('h1');
    h.textContent = 'Three Rouge Round';

    const p = document.createElement('p');
    p.textContent = 'Start a new run or continue.';

    const actions = document.createElement('div');
    actions.className = 'overlay-actions';

    const newRun = makeButton('New Run', { primary: true });
    // MVP: fixed seed for determinism and stable baseline screenshots.
    newRun.onclick = () => handlers.onNewRun(123);

    const cont = makeButton('Continue', { disabled: !hasSave() });
    cont.onclick = () => handlers.onContinue();

    const reset = makeButton('Reset');
    reset.onclick = () => handlers.onReset();

    actions.append(newRun, cont, reset);
    card.append(h, p, actions);
    return card;
  };

  const renderReward = (state: RunState) => {
    const card = document.createElement('div');
    card.className = 'overlay-card';
    card.setAttribute('data-screen', 'reward');

    const h = document.createElement('h1');
    h.textContent = 'Choose an upgrade';

    const p = document.createElement('p');
    p.textContent = 'Pick 1 of 3.';

    const choices = generateRewardChoices({ seed: state.seed, floorIndex: state.floorIndex });

    const list = document.createElement('div');
    list.style.display = 'grid';
    list.style.gap = '10px';

    for (const c of choices) {
      const def = UPGRADE_DEF_BY_ID[c.id];
      const item = document.createElement('div');
      item.style.padding = '10px';
      item.style.borderRadius = '10px';
      item.style.border = '1px solid rgba(255,255,255,0.12)';
      item.style.background = 'rgba(255,255,255,0.06)';

      const name = document.createElement('div');
      name.textContent = def?.name ?? c.id;
      name.style.fontWeight = '600';

      const desc = document.createElement('div');
      desc.textContent = def?.description ?? '';
      desc.style.opacity = '0.85';
      desc.style.marginTop = '4px';

      const actions = document.createElement('div');
      actions.className = 'overlay-actions';

      const pick = makeButton('Pick', { primary: true });
      pick.onclick = () => handlers.onChooseUpgrade(c.id);
      actions.append(pick);

      item.append(name, desc, actions);
      list.append(item);
    }

    card.append(h, p, list);
    return card;
  };

  const renderBetween = (state: RunState) => {
    const card = document.createElement('div');
    card.className = 'overlay-card';
    card.setAttribute('data-screen', 'between');

    const h = document.createElement('h1');
    h.textContent = 'Between fights';

    const p = document.createElement('p');
    p.textContent = `Floor ${state.floorIndex + 1} / ${state.config.floorsCount}`;

    const actions = document.createElement('div');
    actions.className = 'overlay-actions';

    const next = makeButton('Next battle', { primary: true });
    next.onclick = () => handlers.onNextBattle();

    actions.append(next);
    card.append(h, p, actions);
    return card;
  };

  const renderEnd = (state: RunState) => {
    const card = document.createElement('div');
    card.className = 'overlay-card';
    card.setAttribute('data-screen', 'end');

    const h = document.createElement('h1');
    h.textContent = state.endResult === 'victory' ? 'Victory' : 'Defeat';

    const p = document.createElement('p');
    p.textContent = `Reached floor ${state.floorIndex + 1}.`;

    const actions = document.createElement('div');
    actions.className = 'overlay-actions';

    const newRun = makeButton('Start new run', { primary: true });
    newRun.onclick = () => handlers.onStartNewAfterEnd();

    actions.append(newRun);
    card.append(h, p, actions);
    return card;
  };

  const update = (state: RunState) => {
    current = state;

    if (state.screen === 'start') {
      setCard(renderStart());
      return;
    }

    if (state.screen === 'reward') {
      setCard(renderReward(state));
      return;
    }

    if (state.screen === 'between') {
      setCard(renderBetween(state));
      return;
    }

    if (state.screen === 'end') {
      setCard(renderEnd(state));
      return;
    }

    // battle
    setCard(null);
  };

  return {
    mount(host: HTMLElement) {
      if (mounted) return;
      mounted = true;

      // Ensure overlay stacks above canvas.
      host.style.position = 'relative';
      host.appendChild(root);

      // Default to start screen; main.ts will render the actual state.
      update(makeEmptyRunState());
    },
    unmount() {
      if (!mounted) return;
      mounted = false;
      root.remove();
    },
    render(state: RunState) {
      if (!mounted) return;
      update(state);
    },
    isBlockingInput() {
      return current?.screen !== 'battle';
    },
  };
}

// Helpers to be used by main.ts.
export function loadRunFromLocalStorage(): RunState | null {
  return loadRun(window.localStorage);
}

export function saveRunToLocalStorage(state: RunState): void {
  saveRun(window.localStorage, state);
}

export function clearRunFromLocalStorage(): void {
  clearRun(window.localStorage);
}
